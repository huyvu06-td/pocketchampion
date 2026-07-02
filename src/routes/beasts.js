const express = require('express');
const mongoose = require('mongoose');
const { Beast, canViewerEdit } = require('../models/Beast');
const { Creature, normalizeCreatureName, creatureKey } = require('../models/Creature');
const { User, USER_ROLES } = require('../models/User');
const { TeamGuide } = require('../models/TeamGuide');
const crypto = require('crypto');
const { requireAuth, requireRole } = require('../middleware/auth');
const { normalizeBeastPayload, cleanText } = require('../utils/validate');

const router = express.Router();
const USER_SELECT = 'username displayName gameName role roleBase avatarData';

router.use(requireAuth);

function duplicateMessage(req) {
  return req.user.role === 'admin'
    ? 'Bạn đã có một build cho linh thú này. Hãy sửa build cũ nếu muốn thay đổi.'
    : 'Bạn đã có một build cho linh thú này. Mỗi tài khoản build chỉ có 1 build cho cùng một linh thú.';
}

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findCreatureForCreate(req) {
  const creatureId = String(req.body.creatureId || req.body.creature || '').trim();
  if (!mongoose.isValidObjectId(creatureId)) {
    throw new Error('Bạn cần chọn linh thú từ danh sách do admin/mod thêm trước khi build.');
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
    if (!['mod', 'admin'].includes(user.role)) {
      throw new Error(`Linh thú "${cleanName}" chưa có trong danh sách. Chỉ mod/admin được thêm tên linh thú; Cameo cần chọn tên đã có.`);
    }
    creature = await Creature.create({ name: cleanName, key, createdBy: user._id, updatedBy: user._id });
  }
  return creature;
}

function safeUsername(value = '') {
  const raw = String(value || '').trim().toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9_.-]+/g, '_').replace(/^[_\.\-]+|[_\.\-]+$/g, '').slice(0, 32);
  if (/^[a-z0-9_.-]{3,32}$/.test(cleaned)) return cleaned;
  return `builder_${crypto.randomBytes(4).toString('hex')}`;
}

function userBackupJSON(user) {
  if (!user) return null;
  return {
    username: user.username || '',
    displayName: user.displayName || '',
    gameName: user.gameName || '',
    role: user.role || 'mod',
    avatarData: user.avatarData || ''
  };
}

function buildBackupJSON(build) {
  const creature = build.creature || null;
  const createdBy = build.createdBy || null;
  return {
    id: build._id.toString(),
    creatureName: creature?.name || build.name,
    name: creature?.name || build.name,
    role: build.role || 'Khác',
    nature: build.nature || '',
    item: build.item || '',
    passive: build.passive || '',
    skills: Array.isArray(build.skills) ? build.skills.slice(0, 4) : [],
    stats: build.stats || {},
    notes: build.notes || '',
    builderUsername: createdBy?.username || '',
    builderDisplayName: createdBy?.displayName || '',
    builderGameName: createdBy?.gameName || '',
    builderRole: createdBy?.role || '',
    createdAt: build.createdAt,
    updatedAt: build.updatedAt
  };
}

function teamGuideBackupJSON(guide) {
  return {
    id: guide._id.toString(),
    title: guide.title || '',
    note: guide.note || '',
    thumbData: guide.thumbData || '',
    imageData: guide.imageData || '',
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt
  };
}


async function findOrCreateBackupUser(userInfo, fallbackUser) {
  const username = safeUsername(userInfo?.username || fallbackUser.username);
  let user = await User.findOne({ username });
  if (user) return user;

  const role = USER_ROLES.includes(userInfo?.role) && ['cameo', 'mod', 'admin'].includes(userInfo.role) ? userInfo.role : 'mod';
  const randomPassword = crypto.randomBytes(18).toString('base64url');
  user = await User.create({
    username,
    displayName: String(userInfo?.displayName || userInfo?.builderDisplayName || username).slice(0, 60),
    gameName: String(userInfo?.gameName || userInfo?.builderGameName || '').slice(0, 80),
    avatarData: String(userInfo?.avatarData || '').slice(0, 360000),
    role,
    roleBase: role,
    passwordHash: await User.hashPassword(randomPassword)
  });
  return user;
}

async function upsertCreatureForBackup(name, adminUser) {
  const cleanName = normalizeCreatureName(name);
  if (!cleanName) throw new Error('Tên linh thú trong backup bị trống.');
  const key = creatureKey(cleanName);
  let creature = await Creature.findOne({ key });
  if (!creature) {
    creature = await Creature.create({ name: cleanName, key, createdBy: adminUser._id, updatedBy: adminUser._id });
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
      { nature: { $regex: escapeRegex(search), $options: 'i' } },
      { item: { $regex: escapeRegex(search), $options: 'i' } },
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

router.get('/backup/export', requireRole('admin'), async (req, res) => {
  const [creatures, builds, teamGuides] = await Promise.all([
    Creature.find().sort({ name: 1 }),
    Beast.find()
      .populate('creature')
      .populate('createdBy', USER_SELECT)
      .populate('updatedBy', USER_SELECT)
      .sort({ name: 1, updatedAt: -1 }),
    TeamGuide.find().sort({ updatedAt: -1, createdAt: -1 })
  ]);

  const builders = new Map();
  for (const build of builds) {
    const user = userBackupJSON(build.createdBy);
    if (user?.username) builders.set(user.username, user);
  }

  res.json({
    backupType: 'pocket-champion-build-backup',
    version: '2.32',
    exportedAt: new Date().toISOString(),
    note: 'File này dùng để khôi phục tên linh thú, bài build và ảnh đội hình gợi ý. Không chứa mật khẩu gốc.',
    counts: {
      creatures: creatures.length,
      builds: builds.length,
      builders: builders.size,
      teamGuides: teamGuides.length
    },
    builders: Array.from(builders.values()),
    creatures: creatures.map(creature => ({
      name: creature.name,
      key: creature.key,
      generation: creature.generation || null,
      source: creature.source || 'custom',
      suggestedSkills: Array.isArray(creature.suggestedSkills) ? creature.suggestedSkills : [],
      createdAt: creature.createdAt,
      updatedAt: creature.updatedAt
    })),
    builds: builds.map(buildBackupJSON),
    teamGuides: teamGuides.map(teamGuideBackupJSON)
  });
});

router.post('/backup/import', requireRole('admin'), async (req, res) => {
  try {
    const backup = req.body.backup || req.body;
    const clearExisting = Boolean(req.body.clearExisting);
    const confirmText = String(req.body.confirmText || '').trim().toUpperCase();

    if (clearExisting && confirmText !== 'KHOI PHUC') {
      return res.status(400).json({ message: 'Để xóa dữ liệu hiện tại trước khi khôi phục, hãy xác nhận bằng: KHOI PHUC' });
    }

    const rawCreatures = Array.isArray(backup.creatures) ? backup.creatures : [];
    const rawBuilds = Array.isArray(backup.builds) ? backup.builds : Array.isArray(backup.beasts) ? backup.beasts : Array.isArray(backup) ? backup : [];
    const rawBuilders = Array.isArray(backup.builders) ? backup.builders : [];
    const rawTeamGuides = Array.isArray(backup.teamGuides) ? backup.teamGuides : [];

    if (!rawCreatures.length && !rawBuilds.length && !rawTeamGuides.length) {
      return res.status(400).json({ message: 'File backup không có dữ liệu linh thú, build hoặc đội hình gợi ý.' });
    }

    if (clearExisting) {
      await Promise.all([Beast.deleteMany({}), Creature.deleteMany({}), TeamGuide.deleteMany({})]);
    }

    const builderMap = new Map();
    for (const builder of rawBuilders) {
      if (!builder?.username) continue;
      const user = await findOrCreateBackupUser(builder, req.user);
      builderMap.set(builder.username, user);
    }

    let creaturesCreated = 0;
    let creaturesSkipped = 0;
    let buildsCreated = 0;
    let buildsUpdated = 0;
    let teamGuidesCreated = 0;
    let teamGuidesUpdated = 0;
    const errors = [];

    for (const item of rawCreatures) {
      try {
        const name = normalizeCreatureName(item?.name || item);
        if (!name) continue;
        const key = creatureKey(name);
        const set = { updatedBy: req.user._id };
        if (Number(item?.generation || 0)) set.generation = Number(item.generation);
        if (item?.source) set.source = String(item.source).slice(0, 80);
        if (Array.isArray(item?.suggestedSkills)) set.suggestedSkills = item.suggestedSkills.map(skill => String(skill || '').trim()).filter(Boolean).slice(0, 500);

        const result = await Creature.updateOne(
          { key },
          {
            $setOnInsert: { name, key, createdBy: req.user._id },
            $set: set
          },
          { upsert: true }
        );
        if (result.upsertedCount) creaturesCreated += 1;
        else creaturesSkipped += 1;
      } catch (error) {
        errors.push({ type: 'creature', name: item?.name || String(item || ''), message: error.message });
      }
    }

    for (const [index, item] of rawBuilds.entries()) {
      try {
        const creatureName = item.creatureName || item.name || item.creature?.name;
        const creature = await upsertCreatureForBackup(creatureName, req.user);
        const payload = normalizeBeastPayload({
          ...item,
          name: creature.name,
          skills: Array.isArray(item.skills) ? item.skills.slice(0, 4) : item.skills
        });
        const username = item.builderUsername || item.createdBy?.username || item.createdByUsername || '';
        let owner = username ? builderMap.get(username) || await User.findOne({ username: safeUsername(username) }) : null;
        if (!owner && username) {
          owner = await findOrCreateBackupUser({
            username,
            displayName: item.builderDisplayName,
            gameName: item.builderGameName,
            role: item.builderRole || 'mod'
          }, req.user);
        }
        if (!owner) owner = req.user;

        const existing = await Beast.findOne({ creature: creature._id, createdBy: owner._id });
        if (existing) {
          Object.assign(existing, payload, { creature: creature._id, name: creature.name, updatedBy: req.user._id });
          await existing.save();
          buildsUpdated += 1;
        } else {
          await Beast.create({ ...payload, creature: creature._id, name: creature.name, createdBy: owner._id, updatedBy: req.user._id });
          buildsCreated += 1;
        }
      } catch (error) {
        errors.push({ type: 'build', index: index + 1, name: item?.name || item?.creatureName || '', message: error.message });
      }
    }


    for (const [index, item] of rawTeamGuides.entries()) {
      try {
        const title = cleanText(item?.title);
        const note = cleanText(item?.note).slice(0, 500);
        const thumbData = cleanText(item?.thumbData);
        const imageData = cleanText(item?.imageData);
        if (!title || !thumbData || !imageData) continue;

        const existing = await TeamGuide.findOne({ title });
        if (existing) {
          existing.note = note;
          existing.thumbData = thumbData;
          existing.imageData = imageData;
          existing.updatedBy = req.user._id;
          await existing.save();
          teamGuidesUpdated += 1;
        } else {
          await TeamGuide.create({
            title: title.slice(0, 120),
            note,
            thumbData,
            imageData,
            createdBy: req.user._id,
            updatedBy: req.user._id
          });
          teamGuidesCreated += 1;
        }
      } catch (error) {
        errors.push({ type: 'teamGuide', index: index + 1, title: item?.title || '', message: error.message });
      }
    }

    res.json({
      message: `Khôi phục xong: thêm ${creaturesCreated} tên linh thú, thêm ${buildsCreated} build, cập nhật ${buildsUpdated} build, thêm ${teamGuidesCreated} ảnh đội hình, lỗi ${errors.length}.`,
      creaturesCreated,
      creaturesSkipped,
      buildsCreated,
      buildsUpdated,
      teamGuidesCreated,
      teamGuidesUpdated,
      errors
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể khôi phục backup.' });
  }
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

router.post('/', requireRole('cameo', 'mod', 'admin'), async (req, res) => {
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

router.put('/:id', requireRole('cameo', 'mod', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy build.' });
    }
    const beast = await Beast.findById(req.params.id).populate('creature');
    if (!beast) return res.status(404).json({ message: 'Không tìm thấy build.' });

    if (!canViewerEdit(req.user, beast)) {
      return res.status(403).json({ message: 'Cameo/mod chỉ được sửa build do chính mình tạo. Chỉ admin mới sửa được build của người khác.' });
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

router.post('/bulk/import', requireRole('cameo', 'mod', 'admin'), async (req, res) => {
  try {
    const items = Array.isArray(req.body.beasts) ? req.body.beasts : Array.isArray(req.body) ? req.body : [];
    if (!items.length) return res.status(400).json({ message: 'File nhập không có dữ liệu build.' });

    let created = 0;
    let updated = 0;
    const errors = [];

    for (const [index, item] of items.entries()) {
      try {
        const creature = await findOrCreateCreatureByName(item.name, req.user);
        const payload = normalizeBeastPayload({
          ...item,
          name: creature.name,
          skills: Array.isArray(item.skills) ? item.skills.slice(0, 4) : item.skills
        });
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
