const express = require('express');
const mongoose = require('mongoose');
const { Creature, normalizeCreatureName, creatureKey } = require('../models/Creature');
const { Beast } = require('../models/Beast');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const USER_SELECT = 'username displayName gameName role avatarData';
const MAX_BULK_NAMES = 1000;

router.use(requireAuth);

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseNameList(input) {
  const rawItems = Array.isArray(input)
    ? input
    : String(input || '').split(/[\n,;]+/g);

  const seen = new Set();
  const names = [];
  for (const item of rawItems) {
    const name = normalizeCreatureName(item);
    if (!name) continue;
    if (name.length > 120) throw new Error(`Tên linh thú quá dài: ${name.slice(0, 80)}...`);
    const key = creatureKey(name);
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
    if (names.length > MAX_BULK_NAMES) {
      throw new Error(`Mỗi lần chỉ nên nhập tối đa ${MAX_BULK_NAMES} tên linh thú.`);
    }
  }
  return names;
}

async function buildCountMap(creatureIds = null) {
  const match = { creature: { $exists: true, $ne: null } };
  if (Array.isArray(creatureIds)) {
    match.creature = { $in: creatureIds };
  }

  const rows = await Beast.aggregate([
    { $match: match },
    { $group: { _id: '$creature', count: { $sum: 1 } } }
  ]);
  return new Map(rows.map(row => [row._id.toString(), row.count]));
}

router.get('/', async (req, res) => {
  const search = normalizeCreatureName(req.query.search || '');
  const filter = search ? { name: { $regex: escapeRegex(search), $options: 'i' } } : {};
  const creatures = await Creature.find(filter).sort({ name: 1 }).limit(300);
  const countMap = await buildCountMap(creatures.map(creature => creature._id));
  res.json({ creatures: creatures.map(creature => creature.toClient(countMap.get(creature._id.toString()) || 0)) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy linh thú.' });
  }

  const creature = await Creature.findById(req.params.id);
  if (!creature) return res.status(404).json({ message: 'Không tìm thấy linh thú.' });

  const builds = await Beast.find({ creature: creature._id })
    .populate('creature')
    .populate('createdBy', USER_SELECT)
    .populate('updatedBy', USER_SELECT)
    .sort({ updatedAt: -1, createdAt: -1 });

  res.json({
    creature: creature.toClient(builds.length),
    builds: builds.map(build => build.toClient({ viewer: req.user }))
  });
});

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const name = normalizeCreatureName(req.body.name);
    if (!name) throw new Error('Tên linh thú không được để trống.');
    if (name.length > 120) throw new Error('Tên linh thú quá dài.');

    const creature = await Creature.create({
      name,
      key: creatureKey(name),
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    res.status(201).json({ creature: creature.toClient(0), message: 'Đã thêm tên linh thú.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Tên linh thú này đã có trong danh sách.' });
    }
    res.status(400).json({ message: error.message || 'Không thể thêm tên linh thú.' });
  }
});

router.post('/bulk', requireRole('admin'), async (req, res) => {
  try {
    const names = parseNameList(req.body.names ?? req.body.text ?? req.body);
    if (!names.length) return res.status(400).json({ message: 'Danh sách chưa có tên linh thú nào.' });

    let created = 0;
    let skipped = 0;
    const errors = [];

    for (const name of names) {
      try {
        const result = await Creature.updateOne(
          { key: creatureKey(name) },
          {
            $setOnInsert: { name, key: creatureKey(name), createdBy: req.user._id },
            $set: { updatedBy: req.user._id }
          },
          { upsert: true }
        );
        if (result.upsertedCount) created += 1;
        else skipped += 1;
      } catch (error) {
        errors.push({ name, message: error.message });
      }
    }

    res.json({ created, skipped, errors, message: `Đã thêm ${created} tên mới, bỏ qua ${skipped} tên đã tồn tại.` });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể nhập danh sách linh thú.' });
  }
});

router.patch('/:id', requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy linh thú.' });
    }
    const name = normalizeCreatureName(req.body.name);
    if (!name) throw new Error('Tên linh thú không được để trống.');
    if (name.length > 120) throw new Error('Tên linh thú quá dài.');

    const creature = await Creature.findById(req.params.id);
    if (!creature) return res.status(404).json({ message: 'Không tìm thấy linh thú.' });

    creature.name = name;
    creature.key = creatureKey(name);
    creature.updatedBy = req.user._id;
    await creature.save();
    await Beast.updateMany({ creature: creature._id }, { $set: { name } });

    const count = await Beast.countDocuments({ creature: creature._id });
    res.json({ creature: creature.toClient(count), message: 'Đã đổi tên linh thú.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Tên linh thú này đã có trong danh sách.' });
    }
    res.status(400).json({ message: error.message || 'Không thể đổi tên linh thú.' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy linh thú.' });
    }
    const buildCount = await Beast.countDocuments({ creature: req.params.id });
    if (buildCount > 0) {
      return res.status(400).json({ message: 'Linh thú này đã có build, không nên xóa tên. Hãy xóa build trước nếu thật sự cần.' });
    }
    const creature = await Creature.findByIdAndDelete(req.params.id);
    if (!creature) return res.status(404).json({ message: 'Không tìm thấy linh thú.' });
    res.json({ message: 'Đã xóa tên linh thú.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể xóa tên linh thú.' });
  }
});

module.exports = router;
