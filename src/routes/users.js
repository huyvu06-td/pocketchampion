const express = require('express');
const { User, USER_ROLES } = require('../models/User');
const { Beast } = require('../models/Beast');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cleanText, validatePassword, validateUsername } = require('../utils/validate');

const router = express.Router();

router.use(requireAuth);

// Tất cả tài khoản đã đăng nhập đều xem được bảng mod/admin công khai.
router.get('/mods', async (req, res) => {
  const [mods, buildCounts] = await Promise.all([
    User.find({ role: { $in: ['mod', 'admin'] } }).sort({ role: 1, gameName: 1, displayName: 1, username: 1 }),
    Beast.aggregate([
      { $match: { createdBy: { $exists: true, $ne: null } } },
      { $group: { _id: '$createdBy', count: { $sum: 1 } } }
    ])
  ]);

  const countMap = new Map(buildCounts.map(item => [item._id.toString(), item.count]));
  res.json({ mods: mods.map(user => user.publicModJSON(countMap.get(user._id.toString()) || 0)) });
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
    const role = USER_ROLES.includes(req.body.role) ? req.body.role : 'user';
    const passwordHash = await User.hashPassword(req.body.password);

    const user = await User.create({
      username,
      displayName: cleanText(req.body.displayName),
      gameName: cleanText(req.body.gameName),
      role,
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
    const role = req.body.role;
    if (!USER_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'Bạn không thể tự hạ quyền admin của chính mình.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

    user.role = role;
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
