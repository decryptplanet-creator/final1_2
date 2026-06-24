const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createDispute, getDisputes, updateDisputeStatus } = require('../controllers/disputeController');

// Optional: lightweight auth middleware (reads token if present, does not block)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
}

// Multer setup — saves to uploads/disputes/
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'disputes');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images and PDFs allowed'));
  },
});

// POST /api/dispute/upload-evidence — upload files, get back URL list
router.post('/upload-evidence', optionalAuth, upload.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files received' });
  const urls = req.files.map(f => `/uploads/disputes/${f.filename}`);
  res.json({ success: true, urls });
});

router.post('/create', optionalAuth, createDispute);
router.get('/', optionalAuth, getDisputes);
router.put('/:id/status', optionalAuth, updateDisputeStatus);
// Admin resolve alias — maps decision to status
router.put('/resolve/:id', optionalAuth, async (req, res) => {
  const { decision } = req.body;
  const statusMap = { release: 'resolved', refund: 'resolved', suspend: 'escalated' };
  req.params.id = req.params.id;
  req.body.status = statusMap[decision] || 'resolved';
  return updateDisputeStatus(req, res);
});

module.exports = router;
