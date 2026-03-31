import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, storeName, storeDescription, address } = req.body;
  if (name) user.name = name;
  if (storeName) user.storeName = storeName;
  if (storeDescription) user.storeDescription = storeDescription;
  if (address) user.address = { ...user.address.toObject?.() || user.address, ...address };
  // password change
  if (req.body.currentPassword && req.body.newPassword) {
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = req.body.newPassword;
  }
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, address: user.address, storeName: user.storeName });
};
