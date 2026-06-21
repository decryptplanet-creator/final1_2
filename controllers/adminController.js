const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ verificationStatus: 'pending', role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = (field) => async (req, res) => {
  try {
    const update = field === 'reject'
      ? { verificationStatus: 'rejected', rejectionReason: req.body.reason || 'Documents insufficient' }
      : field === 'approve'
      ? { verificationStatus: 'approved', status: 'active', rejectionReason: '' }
      : field === 'unblock'
      ? { status: 'active' }
      : { status: field }; // block | suspend

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Notification.create({
      title: `User ${field.charAt(0).toUpperCase() + field.slice(1)}ed`,
      message: `${user.name} (${user.role}) ko admin ne ${field} kar diya.`,
      type: 'system',
      userId: user._id,
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveUser  = updateUser('approve');
exports.rejectUser   = updateUser('reject');
exports.blockUser    = updateUser('block');
exports.suspendUser  = updateUser('suspend');
exports.unblockUser  = updateUser('unblock');
