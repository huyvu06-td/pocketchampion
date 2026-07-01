const express = require('express');
const { User } = require('../models/User');
const { signToken, requireAuth } = require('../middleware/auth');
const { cleanText, validatePassword, validateUsername, validateAvatarData } = require('../utils/validate');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const username = validateUsername(req.body.username);
    const password = req.body.password;
    validatePassword(password);

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';
    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      username,
      displayName: cleanText(req.body.displayName),
      passwordHash,
      role
    });

    res.status(201).json({
      user: user.safeJSON(),
      token: signToken(user),
      message: role === 'admin'
        ? 'Bạn là tài khoản đầu tiên nên được đặt làm admin.'
        : 'Đăng ký thành công. Tài khoản thường chỉ có quyền tra cứu.'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }
    res.status(400).json({ message: error.message || 'Không thể đăng ký.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const username = validateUsername(req.body.username);
    const password = req.body.password || '';
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    res.json({ user: user.safeJSON(), token: signToken(user) });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể đăng nhập.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user.safeJSON() });
});


router.patch('/me/avatar', requireAuth, async (req, res) => {
  try {
    if (!['mod', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Chỉ mod và admin được đổi avatar.' });
    }

    req.user.avatarData = validateAvatarData(req.body.avatarData);
    await req.user.save();
    res.json({ user: req.user.safeJSON(), message: req.user.avatarData ? 'Đã cập nhật avatar.' : 'Đã xóa avatar.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật avatar.' });
  }
});

router.patch('/me/password', requireAuth, async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword || '';
    const newPassword = req.body.newPassword || '';
    validatePassword(newPassword);

    if (!(await req.user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' });
    }

    req.user.passwordHash = await User.hashPassword(newPassword);
    await req.user.save();
    res.json({ message: 'Đã đổi mật khẩu.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể đổi mật khẩu.' });
  }
});

module.exports = router;
