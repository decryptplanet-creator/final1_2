const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ctrl = require('../controllers/adminController');

function getTokenUser(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET || 'skillora_secret_key'); } catch { return null; }
}

// ── My Notifications (any logged-in user) ─────────────────────────────────────
router.get('/my-notifications', async (req, res) => {
  const user = getTokenUser(req);
  if (!user) return res.status(401).json({ message: 'Token required' });
  try {
    const notifs = await Notification.find({ userId: user.id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/my-notifications/:id/read', async (req, res) => {
  const user = getTokenUser(req);
  if (!user) return res.status(401).json({ message: 'Token required' });
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: user.id }, { isRead: true }, { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Not found' });
    res.json(notif);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Middleware: only admin role allowed
async function adminOnly(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token required' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET || 'skillora_secret_key');
    const user = await User.findById(id).select('role');
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    req.adminId = id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

router.use(adminOnly);

router.get('/notifications',          ctrl.getNotifications);
router.put('/notifications/read-all', ctrl.markAllRead);
router.put('/notifications/:id/read', ctrl.markNotificationRead);
router.get('/users',                  ctrl.getAllUsers);
router.get('/pending-verifications',  ctrl.getPendingVerifications);
router.put('/users/:id/approve',      ctrl.approveUser);
router.put('/users/:id/reject',       ctrl.rejectUser);
router.put('/users/:id/block',        ctrl.blockUser);
router.put('/users/:id/suspend',      ctrl.suspendUser);
router.put('/users/:id/unblock',      ctrl.unblockUser);

module.exports = router;
