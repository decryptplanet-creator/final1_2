const express = require('express');
const router = express.Router();
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

router.post('/create', optionalAuth, createDispute);
router.get('/', optionalAuth, getDisputes);
router.put('/:id/status', optionalAuth, updateDisputeStatus);

module.exports = router;
