const express = require('express');
const { SiteSetting } = require('../models/SiteSetting');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText } = require('../utils/validate');
const { mergeRoleSettings, normalizeRoleKey, normalizeRoleBase, sanitizeRoleColor, cleanRoleLogo, cleanRoleName, BUILTIN_ROLE_KEYS } = require('../utils/roles');

const router = express.Router();
const MAX_DONATE_IMAGE_BYTES = 180 * 1024;
const MAX_DONATE_DATA_URL_LENGTH = 260000;
const MAX_DONATE_HONOR_NAMES = 200;

function validateDonateImageData(imageData) {
  const value = cleanText(imageData);
  if (!value) return '';

  if (value.length > MAX_DONATE_DATA_URL_LENGTH) {
    throw new Error('Ảnh donate quá lớn. Hãy dùng ảnh nhỏ hơn.');
  }

  const match = value.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) {
    throw new Error('Ảnh donate chỉ nhận PNG, JPG hoặc WebP.');
  }

  const byteLength = Buffer.byteLength(match[2], 'base64');
  if (byteLength > MAX_DONATE_IMAGE_BYTES) {
    throw new Error('Ảnh donate sau khi nén phải nhỏ hơn 180KB.');
  }

  return value;
}

function normalizeRegistrationPayload(body = {}) {
  const ipLimit = Math.min(Math.max(Number(body.ipLimit || 3), 1), 20);
  return {
    enabled: Boolean(body.enabled),
    ipLimit
  };
}

function normalizeDonateHonorNames(rawNames) {
  const input = Array.isArray(rawNames)
    ? rawNames
    : String(rawNames || '').split(/[\n,;]+/g);

  const names = [];
  const seen = new Set();
  for (const raw of input) {
    const name = cleanText(typeof raw === 'string' ? raw : raw?.name).replace(/\s+/g, ' ').slice(0, 80);
    if (!name) continue;
    const key = name.toLocaleLowerCase('vi-VN');
    if (seen.has(key)) continue;
    seen.add(key);
    names.push({ name, createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date() });
    if (names.length > MAX_DONATE_HONOR_NAMES) break;
  }
  return names;
}

router.get('/public', async (req, res) => {
  const setting = await SiteSetting.getMain();
  const payload = setting.publicJSON(null);
  if (!payload.donate.enabled) {
    payload.donate = {
      enabled: false,
      visible: false,
      imageData: '',
      accountNumber: '',
      bankName: '',
      updatedAt: payload.donate.updatedAt
    };
  }
  if (!payload.donateHonor.enabled) {
    payload.donateHonor = {
      enabled: false,
      visible: false,
      names: [],
      updatedAt: payload.donateHonor.updatedAt
    };
  }
  res.json(payload);
});

router.get('/donate', requireAuth, requireRole('admin'), async (req, res) => {
  const setting = await SiteSetting.getMain();
  res.json(setting.publicJSON(req.user));
});

router.patch('/donate', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const setting = await SiteSetting.getMain();
    const accountNumber = cleanText(req.body.accountNumber);
    const bankName = cleanText(req.body.bankName);

    if (accountNumber.length > 80) {
      return res.status(400).json({ message: 'STK tối đa 80 ký tự.' });
    }
    if (bankName.length > 120) {
      return res.status(400).json({ message: 'Tên ngân hàng tối đa 120 ký tự.' });
    }

    setting.donate = {
      enabled: Boolean(req.body.enabled),
      imageData: validateDonateImageData(req.body.imageData),
      accountNumber,
      bankName,
      updatedBy: req.user._id
    };
    await setting.save();

    res.json({
      message: setting.donate.enabled ? 'Đã bật và lưu thông tin donate.' : 'Đã lưu thông tin donate, hiện đang ẩn với người xem.',
      ...setting.publicJSON(req.user)
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể lưu cấu hình donate.' });
  }
});

router.get('/donate-honor', requireAuth, async (req, res) => {
  const setting = await SiteSetting.getMain();
  res.json(setting.publicJSON(req.user));
});

router.patch('/donate-honor', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const setting = await SiteSetting.getMain();
    setting.donateHonor = {
      enabled: Boolean(req.body.enabled),
      names: normalizeDonateHonorNames(req.body.names),
      updatedBy: req.user._id
    };
    await setting.save();
    res.json({
      message: setting.donateHonor.enabled ? 'Đã bật Vinh danh Donate.' : 'Đã lưu Vinh danh Donate, hiện đang ẩn.',
      ...setting.publicJSON(req.user)
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể lưu Vinh danh Donate.' });
  }
});

router.get('/registration', requireAuth, requireRole('admin'), async (req, res) => {
  const setting = await SiteSetting.getMain();
  res.json(setting.publicJSON(req.user));
});

router.patch('/registration', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const setting = await SiteSetting.getMain();
    setting.registration = {
      ...normalizeRegistrationPayload(req.body),
      updatedBy: req.user._id
    };
    await setting.save();
    res.json({
      message: setting.registration.enabled ? `Đã bật đăng ký tự do, giới hạn ${setting.registration.ipLimit} tài khoản/IP.` : 'Đã tắt đăng ký tự do.',
      ...setting.publicJSON(req.user)
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể lưu cài đặt đăng ký.' });
  }
});

router.get('/roles', requireAuth, async (req, res) => {
  const setting = await SiteSetting.getMain();
  res.json({ roles: mergeRoleSettings(setting.roles || []) });
});

router.put('/roles', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const inputRoles = Array.isArray(req.body.roles) ? req.body.roles : [];
    if (!inputRoles.length) {
      return res.status(400).json({ message: 'Danh sách role không được để trống.' });
    }

    const normalized = [];
    const seen = new Set();
    for (const item of inputRoles) {
      const key = normalizeRoleKey(item?.key || item?.name);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      normalized.push({
        key,
        name: cleanRoleName(item?.name, key),
        color: sanitizeRoleColor(item?.color),
        logo: cleanRoleLogo(item?.logo),
        baseRole: BUILTIN_ROLE_KEYS.includes(key) ? key : normalizeRoleBase(item?.baseRole),
        locked: BUILTIN_ROLE_KEYS.includes(key)
      });
    }

    const setting = await SiteSetting.getMain();
    setting.roles = mergeRoleSettings(normalized);
    await setting.save();

    // Cập nhật roleBase của những tài khoản đang dùng role custom/built-in để quyền khớp cấu hình mới.
    const { User } = require('../models/User');
    const roleMap = new Map(setting.roles.map(role => [role.key, role]));
    const users = await User.find({});
    for (const user of users) {
      const role = roleMap.get(user.role) || roleMap.get('user');
      if (user.roleBase !== role.baseRole) {
        user.roleBase = role.baseRole;
        await user.save();
      }
    }

    res.json({ message: 'Đã lưu cấu hình role.', roles: mergeRoleSettings(setting.roles || []) });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể lưu cấu hình role.' });
  }
});

module.exports = router;
