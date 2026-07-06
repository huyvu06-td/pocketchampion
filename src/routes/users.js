const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Beast } = require('../models/Beast');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText, validatePassword, validateUsername } = require('../utils/validate');
const { SiteSetting } = require('../models/SiteSetting');
const { ModApplication } = require('../models/ModApplication');
const { mergeRoleSettings, getRoleDefinition, baseRoleForUser, canBaseAtLeast } = require('../utils/roles');

const router = express.Router();

router.use(requireAuth);

// Tất cả tài khoản đã đăng nhập đều xem được bảng mod/admin công khai.
async function getBuildCountMap() {
  const buildCounts = await Beast.aggregate([
    { $match: { createdBy: { $exists: true, $ne: null }, $or: [{ status: 'approved' }, { status: { $exists: false } }] } },
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
  const buildFilter = baseRoleForUser(req.user) === 'admin'
    ? { createdBy: user._id }
    : { createdBy: user._id, $or: [{ status: 'approved' }, { status: { $exists: false } }, { createdBy: req.user._id }] };

  const builds = await Beast.find(buildFilter)
    .populate('creature')
    .populate('createdBy', 'username displayName gameName role roleBase avatarData')
    .populate('updatedBy', 'username displayName gameName role roleBase avatarData')
    .sort({ name: 1, updatedAt: -1 });

  res.json({
    user: user.publicModJSON(builds.length),
    builds: builds.map(build => build.toClient({ viewer: req.user }))
  });
});


router.post('/mod-applications', async (req, res) => {
  try {
    const base = baseRoleForUser(req.user);
    if (['mod', 'admin'].includes(base)) {
      return res.status(400).json({ message: 'Tài khoản này đã có quyền mod/admin.' });
    }
    const existing = await ModApplication.findOne({ user: req.user._id, status: 'pending' });
    if (existing) {
      return res.status(409).json({ message: 'Bạn đã gửi đơn ứng cử mod và đang chờ admin duyệt.' });
    }
    const app = await ModApplication.create({
      user: req.user._id,
      message: cleanText(req.body.message || '').slice(0, 1000)
    });
    res.status(201).json({ application: app, message: 'Đã gửi đơn ứng cử mod. Hãy chờ admin duyệt.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể gửi đơn ứng cử mod.' });
  }
});

router.use(requireRole('admin'));


router.get('/mod-applications', async (req, res) => {
  const status = String(req.query.status || 'pending').trim().toLowerCase();
  const filter = status && status !== 'all' ? { status } : {};
  const applications = await ModApplication.find(filter)
    .populate('user', 'username displayName gameName role roleBase avatarData createdAt')
    .populate('reviewedBy', 'username displayName gameName role roleBase avatarData')
    .sort({ createdAt: -1 })
    .limit(300);
  res.json({ applications: applications.map(item => ({
    id: item._id.toString(),
    message: item.message || '',
    status: item.status || 'pending',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    reviewedAt: item.reviewedAt,
    reviewNote: item.reviewNote || '',
    user: item.user ? item.user.safeJSON ? item.user.safeJSON() : {
      id: item.user._id.toString(),
      username: item.user.username,
      displayName: item.user.displayName || '',
      gameName: item.user.gameName || '',
      avatarData: item.user.avatarData || '',
      role: item.user.role || 'user',
      roleBase: baseRoleForUser(item.user),
      createdAt: item.user.createdAt
    } : null,
    reviewedBy: item.reviewedBy ? {
      id: item.reviewedBy._id.toString(),
      username: item.reviewedBy.username,
      displayName: item.reviewedBy.displayName || '',
      gameName: item.reviewedBy.gameName || '',
      avatarData: item.reviewedBy.avatarData || '',
      role: item.reviewedBy.role || 'user',
      roleBase: baseRoleForUser(item.reviewedBy)
    } : null
  })) });
});

router.patch('/mod-applications/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng cử.' });
    }
    const action = String(req.body.action || '').trim().toLowerCase();
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Thao tác duyệt không hợp lệ.' });
    }
    const application = await ModApplication.findById(req.params.id).populate('user');
    if (!application || !application.user) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng cử.' });
    }
    application.status = action === 'approve' ? 'approved' : 'rejected';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.reviewNote = cleanText(req.body.reviewNote || '').slice(0, 1000);
    if (action === 'approve') {
      application.user.role = 'mod';
      application.user.roleBase = 'mod';
      await application.user.save();
    }
    await application.save();
    res.json({ message: action === 'approve' ? 'Đã duyệt và nâng tài khoản lên mod.' : 'Đã từ chối đơn ứng cử mod.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể xử lý đơn ứng cử.' });
  }
});



router.get('/stats', async (req, res) => {
  const [totalBuilds, builtCreatureIds, users] = await Promise.all([
    Beast.countDocuments({ $or: [{ status: 'approved' }, { status: { $exists: false } }] }),
    Beast.distinct('creature', { creature: { $exists: true, $ne: null }, $or: [{ status: 'approved' }, { status: { $exists: false } }] }),
    User.find().sort({ createdAt: -1 }).select('username displayName gameName role roleBase avatarData createdAt createdVia registrationIp')
  ]);

  const byDay = new Map();
  for (const user of users) {
    const date = user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : 'Không rõ ngày';
    if (!byDay.has(date)) byDay.set(date, []);
    byDay.get(date).push({
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName || '',
      gameName: user.gameName || '',
      avatarData: user.avatarData || '',
      role: user.role || 'user',
      roleBase: baseRoleForUser(user),
      createdAt: user.createdAt,
      createdVia: user.createdVia || 'admin'
    });
  }

  const registrationsByDay = [...byDay.entries()]
    .sort((a, b) => String(b[0]).localeCompare(String(a[0])))
    .map(([date, dayUsers]) => ({
      date,
      count: dayUsers.length,
      users: dayUsers
    }));

  res.json({
    totalBuilds,
    totalBuiltPokemon: builtCreatureIds.filter(Boolean).length,
    totalUsers: users.length,
    registrationsByDay
  });
});

router.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim();
  const filter = {};
  if (search) {
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { username: { $regex: safe, $options: 'i' } },
      { displayName: { $regex: safe, $options: 'i' } },
      { gameName: { $regex: safe, $options: 'i' } }
    ];
  }
  const users = await User.find(filter).sort({ role: 1, username: 1 }).limit(search ? 100 : 1000);
  res.json({ users: users.map(user => user.safeJSON()) });
});

router.post('/', async (req, res) => {
  try {
    const username = validateUsername(req.body.username);
    validatePassword(req.body.password);
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: 'Hai lần nhập mật khẩu không khớp.' });
    }
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
      createdVia: 'admin',
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
