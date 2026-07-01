const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Beast } = require('../models/Beast');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText, validatePassword, validateUsername } = require('../utils/validate');
const { SiteSetting } = require('../models/SiteSetting');
const { mergeRoleSettings, getRoleDefinition, baseRoleForUser, canBaseAtLeast } = require('../utils/roles');

const router = express.Router();

router.use(requireAuth);

// Tất cả tài khoản đã đăng nhập đều xem được bảng mod/admin công khai.
async function getBuildCountMap() {
  const buildCounts = await Beast.aggregate([
    { $match: { createdBy: { $exists: true, $ne: null } } },
    { $group: { _id: '$createdBy', count: { $sum: 1 } } }
  ]);
  return new Map(buildCounts.map(item => [item._id.toString(), item.count]));
}

router.get('/mods', async (req, res) => {
  const setting = await SiteSetting.getMain();
  const roleDefs = mergeRoleSettings(setting.roles || []);
  const buildRoleKeys = roleDefs.filter(role => canBaseAtLeast(role.baseRole, 'cameo')).map(role => role.key);
  const [mods, countMap] = await Promise.all([
    User.find({ $or: [{ role: { $in: buildRoleKeys } }, { roleBase: { $in: ['cameo', 'mod', 'admin'] } }] }).sort({ gameName: 1, displayName: 1, username: 1 }),
    getBuildCountMap()
  ]);

  const rows = mods
    .map(user => user.publicModJSON(countMap.get(user._id.toString()) || 0))
    .sort((a, b) => Number(b.buildCount || 0) - Number(a.buildCount || 0) || String(a.gameName || a.displayName || a.username).localeCompare(String(b.gameName || b.displayName || b.username), 'vi'));

  res.json({ mods: rows });
});

router.get('/:id/builds', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy người build này.' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người build này.' });
  }

  // v2.24: Cho phép mở trang người build theo id từ bảng xếp hạng/danh sách mod.
  // Một số tài khoản dùng custom role có baseRole lưu cũ, nên không chặn cứng
  // theo baseRole ở endpoint này nữa. Danh sách hiển thị công khai vẫn được lọc ở /mods.
  const builds = await Beast.find({ createdBy: user._id })
    .populate('creature')
    .populate('createdBy', 'username displayName gameName role roleBase avatarData')
    .populate('updatedBy', 'username displayName gameName role roleBase avatarData')
    .sort({ name: 1, updatedAt: -1 });

  res.json({
    user: user.publicModJSON(builds.length),
    builds: builds.map(build => build.toClient({ viewer: req.user }))
  });
});

router.use(requireRole('admin'));

router.get('/', async (req, res) => {
  const users = await User.find().sort({ role: 1, username: 1 });
  res.json({ users: users.map(user => user.safeJSON()) });
});

router.post('/', async (req, res) => {
  try {
    const username = validateUsername(req.body.username);
    validatePassword(req.body.password);
    const setting = await SiteSetting.getMain();
    const roleDef = getRoleDefinition(setting.roles || [], req.body.role || 'user');
    const role = roleDef.key;
    const passwordHash = await User.hashPassword(req.body.password);

    const user = await User.create({
      username,
      displayName: cleanText(req.body.displayName),
      gameName: cleanText(req.body.gameName),
      role,
      roleBase: roleDef.baseRole,
      passwordHash
    });

    res.status(201).json({ user: user.safeJSON() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }
    res.status(400).json({ message: error.message || 'Không thể tạo tài khoản.' });
  }
});

router.patch('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

    user.displayName = cleanText(req.body.displayName);
    user.gameName = cleanText(req.body.gameName);
    await user.save();

    res.json({ user: user.safeJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật tên.' });
  }
});

router.patch('/:id/role', async (req, res) => {
  try {
    const setting = await SiteSetting.getMain();
    const roleDef = getRoleDefinition(setting.roles || [], req.body.role || 'user');
    const role = roleDef.key;

    if (req.params.id === req.user._id.toString() && roleDef.baseRole !== 'admin') {
      return res.status(400).json({ message: 'Bạn không thể tự hạ quyền admin của chính mình.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

    user.role = role;
    user.roleBase = roleDef.baseRole;
    await user.save();
    res.json({ user: user.safeJSON() });
  } catch (error) {
    res.status(400).json({ message: 'Không thể đổi quyền tài khoản.' });
  }
});

router.patch('/:id/password', async (req, res) => {
  try {
    validatePassword(req.body.password);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

    user.passwordHash = await User.hashPassword(req.body.password);
    await user.save();
    res.json({ message: `Đã đặt lại mật khẩu cho ${user.username}.` });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể đặt lại mật khẩu.' });
  }
});

router.delete('/:id', async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Bạn không thể xóa chính mình.' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
  res.json({ message: 'Đã xóa tài khoản.' });
});

module.exports = router;
