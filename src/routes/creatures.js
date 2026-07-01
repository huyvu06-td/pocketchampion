const express = require('express');
const mongoose = require('mongoose');
const { Creature, normalizeCreatureName, creatureKey } = require('../models/Creature');
const { Beast } = require('../models/Beast');
const { requireAuth, requireRole } = require('../middleware/auth');
const { seedPokemonCatalog, pokemonCatalogStats } = require('../utils/pokemonSeed');

const router = express.Router();
const USER_SELECT = 'username displayName gameName role roleBase avatarData';
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
  const limit = Math.min(Math.max(Number(req.query.limit || 300), 1), 3000);
  const builtOnly = ['1', 'true', 'yes'].includes(String(req.query.builtOnly || '').trim().toLowerCase());
  const filter = search ? { name: { $regex: escapeRegex(search), $options: 'i' } } : {};
  const [creatures, total] = await Promise.all([
    Creature.find(filter).sort({ name: 1 }).limit(limit),
    Creature.countDocuments(filter)
  ]);
  const countMap = await buildCountMap(creatures.map(creature => creature._id));
  const rows = creatures
    .map(creature => creature.toClient(countMap.get(creature._id.toString()) || 0))
    .filter(creature => !builtOnly || Number(creature.buildCount || 0) > 0);

  res.json({
    total: builtOnly ? rows.length : total,
    limit,
    builtOnly,
    creatures: rows
  });
});


router.get('/pokemon/stats', async (req, res) => {
  const existing = await Creature.countDocuments({ source: 'pokemon-gen1-9' });
  res.json({ ...pokemonCatalogStats(), existing });
});

router.post('/seed-pokemon', requireRole('admin'), async (req, res) => {
  try {
    const result = await seedPokemonCatalog({ userId: req.user._id, force: true });
    res.json({
      ...result,
      message: `Đã nhập sẵn ${result.total} Pokémon tiến hóa cuối Gen 1-9 và ${result.totalSkills} tên skill. Thêm mới ${result.inserted}, cập nhật ${result.modified}, xóa tên Pokémon cũ chưa có build ${result.removedOldPokemon || 0}.`
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể nhập sẵn Pokémon.' });
  }
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
    creature: creature.toClient(builds.length, { includeSkills: true }),
    builds: builds.map(build => build.toClient({ viewer: req.user }))
  });
});

router.post('/', requireRole('mod', 'admin'), async (req, res) => {
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

    res.status(201).json({ creature: creature.toClient(0), message: req.user.role === 'admin' ? 'Đã thêm tên linh thú.' : 'Đã thêm tên linh thú để bạn build.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Tên linh thú này đã có trong danh sách.' });
    }
    res.status(400).json({ message: error.message || 'Không thể thêm tên linh thú.' });
  }
});

router.post('/bulk', requireRole('mod', 'admin'), async (req, res) => {
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

router.delete('/all', requireRole('admin'), async (req, res) => {
  try {
    const confirmText = String(req.body.confirmText || req.query.confirmText || '').trim().toUpperCase();
    if (confirmText !== 'XOA TAT CA') {
      return res.status(400).json({ message: 'Để xóa tất cả, hãy nhập chính xác: XOA TAT CA' });
    }

    const [buildResult, creatureResult] = await Promise.all([
      Beast.deleteMany({}),
      Creature.deleteMany({})
    ]);

    res.json({
      message: `Đã xóa ${creatureResult.deletedCount || 0} tên linh thú và ${buildResult.deletedCount || 0} bài build.`,
      deletedCreatures: creatureResult.deletedCount || 0,
      deletedBuilds: buildResult.deletedCount || 0
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể xóa tất cả linh thú.' });
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
