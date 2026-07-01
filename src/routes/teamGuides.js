const express = require('express');
const mongoose = require('mongoose');
const { TeamGuide } = require('../models/TeamGuide');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText } = require('../utils/validate');

const router = express.Router();
const USER_SELECT = 'username displayName gameName role avatarData';
const MAX_GUIDE_THUMB_BYTES = 80 * 1024;
const MAX_GUIDE_IMAGE_BYTES = 520 * 1024;
const MAX_GUIDE_THUMB_DATA_URL_LENGTH = 130000;
const MAX_GUIDE_IMAGE_DATA_URL_LENGTH = 760000;

router.use(requireAuth);

function validateImageData(imageData, options) {
  const value = cleanText(imageData);
  if (!value) throw new Error(`${options.label} không được để trống.`);

  if (value.length > options.maxLength) {
    throw new Error(`${options.label} quá lớn. Hãy dùng ảnh nhẹ hơn.`);
  }

  const match = value.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) {
    throw new Error(`${options.label} chỉ nhận PNG, JPG hoặc WebP.`);
  }

  const byteLength = Buffer.byteLength(match[2], 'base64');
  if (byteLength > options.maxBytes) {
    throw new Error(`${options.label} sau khi nén phải nhỏ hơn ${Math.round(options.maxBytes / 1024)}KB.`);
  }

  return value;
}

function normalizePayload(body = {}) {
  const title = cleanText(body.title);
  const note = cleanText(body.note);

  if (!title) throw new Error('Cần nhập chú thích đội hình.');
  if (title.length > 120) throw new Error('Chú thích đội hình tối đa 120 ký tự.');
  if (note.length > 500) throw new Error('Ghi chú đội hình tối đa 500 ký tự.');

  return {
    title,
    note,
    thumbData: validateImageData(body.thumbData, {
      label: 'Ảnh thu nhỏ đội hình',
      maxBytes: MAX_GUIDE_THUMB_BYTES,
      maxLength: MAX_GUIDE_THUMB_DATA_URL_LENGTH
    }),
    imageData: validateImageData(body.imageData, {
      label: 'Ảnh đội hình',
      maxBytes: MAX_GUIDE_IMAGE_BYTES,
      maxLength: MAX_GUIDE_IMAGE_DATA_URL_LENGTH
    })
  };
}

router.get('/', async (req, res) => {
  const guides = await TeamGuide.find()
    .populate('createdBy', USER_SELECT)
    .sort({ updatedAt: -1, createdAt: -1 });

  res.json({ guides: guides.map(guide => guide.toClient()) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });
  }

  const guide = await TeamGuide.findById(req.params.id).populate('createdBy', USER_SELECT);
  if (!guide) return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });
  res.json({ guide: guide.toClient({ includeImage: true }) });
});

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const guide = await TeamGuide.create({ ...payload, createdBy: req.user._id, updatedBy: req.user._id });
    await guide.populate('createdBy', USER_SELECT);
    res.status(201).json({ message: 'Đã thêm đội hình gợi ý.', guide: guide.toClient() });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể thêm đội hình gợi ý.' });
  }
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });
    }
    const guide = await TeamGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });

    Object.assign(guide, normalizePayload(req.body), { updatedBy: req.user._id });
    await guide.save();
    await guide.populate('createdBy', USER_SELECT);
    res.json({ message: 'Đã cập nhật đội hình gợi ý.', guide: guide.toClient() });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật đội hình gợi ý.' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });
  }
  const guide = await TeamGuide.findByIdAndDelete(req.params.id);
  if (!guide) return res.status(404).json({ message: 'Không tìm thấy đội hình gợi ý.' });
  res.json({ message: 'Đã xóa đội hình gợi ý.' });
});

module.exports = router;
