const express = require('express');
const { SiteSetting } = require('../models/SiteSetting');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText } = require('../utils/validate');

const router = express.Router();
const MAX_DONATE_IMAGE_BYTES = 180 * 1024;
const MAX_DONATE_DATA_URL_LENGTH = 260000;

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

module.exports = router;
