import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: role || 'buyer' });
  const token = signToken(user._id);
  res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken(user._id);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/me
router.put('/me', protect, async (req, res) => {
  const { name, storeName, storeDescription, address } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (storeName) user.storeName = storeName;
  if (storeDescription) user.storeDescription = storeDescription;
  if (address) user.address = { ...user.address, ...address };
  await user.save();
  res.json(user);
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'No account with that email' });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"ShopHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 10 minutes.</p>`,
    });
    res.json({ message: 'Reset email sent' });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Email could not be sent' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = signToken(user._id);
  res.json({ token, message: 'Password reset successful' });
});

export default router;
