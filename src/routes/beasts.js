const express = require('express');
const mongoose = require('mongoose');
const { Beast, canViewerEdit } = require('../models/Beast');
const { Creature, normalizeCreatureName, creatureKey } = require('../models/Creature');
const { requireAuth, requireRole } = require('../middleware/auth');
const { normalizeBeastPayload } = require('../utils/validate');

const router = express.Router();
const USER_SELECT = 'username displayName gameName role avatarData';

router.use(requireAuth);

function duplicateMessage(req) {
  return req.user.role === 'admin'
    ? 'Bạn đã có một build cho linh thú này. Hãy sửa build cũ nếu muốn thay đổi.'
    : 'Bạn đã có một build cho linh thú này. Mỗi mod chỉ có 1 build cho cùng một linh thú.';
}

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findCreatureForCreate(req) {
  const creatureId = String(req.body.creatureId || req.body.creature || '').trim();
  if (!mongoose.isValidObjectId(creatureId)) {
    throw new Error('Bạn cần chọn linh thú từ danh sách do admin thêm trước khi build.');
  }
  const creature = await Creature.findById(creatureId);
  if (!creature) {
    throw new Error('Tên linh thú này chưa có trong danh sách hoặc đã bị xóa.');
  }
  return creature;
}

async function findOrCreateCreatureByName(name, user) {
  const cleanName = normalizeCreatureName(name);
  if (!cleanName) throw new Error('Tên linh thú không được để trống.');
  const key = creatureKey(cleanName);
  let creature = await Creature.findOne({ key });
  if (!creature) {
    if (user.role !== 'admin') {
      throw new Error(`Linh thú "${cleanName}" chưa có trong danh sách. Chỉ admin được thêm tên linh thú.`);
    }
    creature = await Creature.create({ name: cleanName, key, createdBy: user._id, updatedBy: user._id });
  }
  return creature;
}

router.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim();
  const role = String(req.query.role || '').trim();
  const creatureId = String(req.query.creatureId || '').trim();
  const filter = {};

  if (creatureId) {
    if (!mongoose.isValidObjectId(creatureId)) return res.status(400).json({ message: 'Mã linh thú không hợp lệ.' });
    filter.creature = creatureId;
  } else if (search) {
    filter.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { element: { $regex: escapeRegex(search), $options: 'i' } },
      { nature: { $regex: escapeRegex(search), $options: 'i' } },
      { role: { $regex: escapeRegex(search), $options: 'i' } }
    ];
  }
  if (role) filter.role = role;

  const beasts = await Beast.find(filter)
    .populate('creature')
    .populate('createdBy', USER_SELECT)
    .populate('updatedBy', USER_SELECT)
    .sort({ name: 1, updatedAt: -1, createdAt: -1 });

  res.json({ beasts: beasts.map(beast => beast.toClient({ viewer: req.user })) });
});

router.get('/roles', async (req, res) => {
  const roles = await Beast.distinct('role');
  res.json({ roles: roles.filter(Boolean).sort((a, b) => a.localeCompare(b, 'vi')) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy build.' });
  }
  const beast = await Beast.findById(req.params.id)
    .populate('creature')
    .populate('createdBy', USER_SELECT)
    .populate('updatedBy', USER_SELECT);
  if (!beast) return res.status(404).json({ message: 'Không tìm thấy build.' });
  res.json({ beast: beast.toClient({ viewer: req.user }) });
});

router.post('/', requireRole('mod', 'admin'), async (req, res) => {
  try {
    const creature = await findCreatureForCreate(req);
    const payload = normalizeBeastPayload({ ...req.body, name: creature.name });
    const beast = await Beast.create({
      ...payload,
      creature: creature._id,
      name: creature.name,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
    await beast.populate('creature');
    await beast.populate('createdBy', USER_SELECT);
    await beast.populate('updatedBy', USER_SELECT);
    res.status(201).json({ beast: beast.toClient({ viewer: req.user }) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage(req) });
    }
    res.status(400).json({ message: error.message || 'Không thể thêm build.' });
  }
});

router.put('/:id', requireRole('mod', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy build.' });
    }
    const beast = await Beast.findById(req.params.id).populate('creature');
    if (!beast) return res.status(404).json({ message: 'Không tìm thấy build.' });

    if (!canViewerEdit(req.user, beast)) {
      return res.status(403).json({ message: 'Mod chỉ được sửa build do chính mod đó tạo. Chỉ admin mới sửa được build của người khác.' });
    }

    const buildName = beast.creature?.name || beast.name;
    const payload = normalizeBeastPayload({ ...req.body, name: buildName });
    Object.assign(beast, payload, { name: buildName, updatedBy: req.user._id });
    await beast.save();
    await beast.populate('creature');
    await beast.populate('createdBy', USER_SELECT);
    await beast.populate('updatedBy', USER_SELECT);
    res.json({ beast: beast.toClient({ viewer: req.user }) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage(req) });
    }
    res.status(400).json({ message: error.message || 'Không thể sửa build.' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy build.' });
  }
  const beast = await Beast.findByIdAndDelete(req.params.id);
  if (!beast) return res.status(404).json({ message: 'Không tìm thấy build.' });
  res.json({ message: 'Đã xóa build.' });
});

router.post('/bulk/import', requireRole('mod', 'admin'), async (req, res) => {
  try {
    const items = Array.isArray(req.body.beasts) ? req.body.beasts : Array.isArray(req.body) ? req.body : [];
    if (!items.length) return res.status(400).json({ message: 'File nhập không có dữ liệu build.' });

    let created = 0;
    let updated = 0;
    const errors = [];

    for (const [index, item] of items.entries()) {
      try {
        const creature = await findOrCreateCreatureByName(item.name, req.user);
        const payload = normalizeBeastPayload({ ...item, name: creature.name });
        const existing = await Beast.findOne({ creature: creature._id, createdBy: req.user._id });
        if (existing) {
          Object.assign(existing, payload, { creature: creature._id, name: creature.name, updatedBy: req.user._id });
          await existing.save();
          updated += 1;
        } else {
          await Beast.create({ ...payload, creature: creature._id, name: creature.name, createdBy: req.user._id, updatedBy: req.user._id });
          created += 1;
        }
      } catch (error) {
        errors.push({ index: index + 1, name: item?.name || '', message: error.message });
      }
    }

    res.json({ created, updated, errors });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể nhập dữ liệu.' });
  }
});

module.exports = router;
