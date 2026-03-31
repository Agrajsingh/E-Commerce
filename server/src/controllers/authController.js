import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: role || 'buyer' });
  const token = signToken(user._id);
  res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken(user._id);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = (req, res) => {
  res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
  const { name, storeName, storeDescription, address } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (storeName) user.storeName = storeName;
  if (storeDescription) user.storeDescription = storeDescription;
  if (address) user.address = { ...user.address, ...address };
  await user.save();
  res.json(user);
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
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
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
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
};
