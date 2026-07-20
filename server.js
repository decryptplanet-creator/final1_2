require('dotenv').config(); // ✅ Load .env variables
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const path = require('path');
app.use(express.json());
app.use('/uploads', require('express').static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://junaidmussawwar1_db_user:skillora321@cluster0.cg7mmxx.mongodb.net/SialkotHub';
mongoose.connect(MONGO_URI).then(() => console.log('✅ MongoDB connected')).catch(e => console.error('❌ MongoDB error:', e));

const messageSchema = new mongoose.Schema({
  orderId: String,
  conversationId: String,
  sender: String,
  senderName: String,
  receiver: String,
  receiverName: String,
  message: String,
  messageType: { type: String, default: 'text' },
  isRead: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  flagReason: String,
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  participants: [String],
  lastMessage: String,
  unreadCount: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockedReason: String,
  updatedAt: { type: Date, default: Date.now },
});

const userSocketSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  socketId: String,
  updatedAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const UserSocket = mongoose.model('UserSocket', userSocketSchema);

// ─── JWT Middleware ───────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── AI Dispute Detection (server-side) ──────────────────────────────────────
const DISPUTE_KEYWORDS = [
  'fraud', 'scam', 'cheat', 'fake', 'steal', 'threat', 'kill', 'blackmail',
  'refund outside', 'pay directly', 'bypass', 'cancel order', 'dhoka', 'fareb',
  'mar dunga', 'jaan se', 'bahar pay', 'direct payment'
];

function checkDispute(text) {
  const lower = text.toLowerCase();
  const matched = DISPUTE_KEYWORDS.find(kw => lower.includes(kw));
  return matched ? `Suspicious content detected: "${matched}"` : null;
}

// ─── Dispute Routes ───────────────────────────────────────────────────────────
const disputeRoutes = require('./routes/disputeRoutes');
app.use('/api/dispute', disputeRoutes);

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET inbox
app.get('/api/messages/inbox', verifyToken, async (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) return res.json([]);
  try {
    const convs = await Conversation.find({ participants: userId }).sort({ updatedAt: -1 });
    const inbox = await Promise.all(convs.map(async (conv) => {
      const last = await Message.findOne({ orderId: conv.orderId }).sort({ createdAt: -1 });
      const otherId = conv.participants.find(p => p !== userId) || '';
      return {
        _id: conv._id,
        orderId: conv.orderId,
        lastMessage: last?.message?.startsWith('IMAGE_DATA:') ? '📷 Image' : (last?.message || ''),
        updatedAt: conv.updatedAt,
        with: { id: otherId, name: last ? (String(last.sender) === userId ? (last.receiverName || otherId) : (last.senderName || otherId)) : otherId },
        unread: conv.unreadCount || 0,
        isLocked: conv.isLocked,
      };
    }));
    res.json(inbox);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET messages by orderId
app.get('/api/messages/:orderId', verifyToken, async (req, res) => {
  const userId = String(req.user.id || req.user._id || req.user.userId || '');
  const { orderId } = req.params;
  try {
    const conv = await Conversation.findOne({ orderId });
    if (conv && userId && !conv.participants.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (conv?.isLocked) return res.status(403).json({ error: 'Chat locked', locked: true });
    const msgs = await Message.find({ orderId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST new message
app.post('/api/messages', verifyToken, async (req, res) => {
  const { orderId, sender, senderName, receiver, receiverName, message } = req.body;
  try {
    // Participant check
    const conv = await Conversation.findOne({ orderId });
    if (conv?.isLocked) return res.status(403).json({ error: 'Chat is locked for security review', locked: true });

    // Server-side AI dispute detection
    const flagReason = checkDispute(message || '');
    const isFlagged = !!flagReason;
    let warnings = 0;

    if (isFlagged) {
      // Count existing flags for this conversation
      warnings = await Message.countDocuments({ orderId, isFlagged: true }) + 1;
      if (warnings >= 3) {
        await Conversation.findOneAndUpdate(
          { orderId },
          { isLocked: true, lockedReason: flagReason, updatedAt: new Date() },
          { upsert: true }
        );
        return res.status(403).json({ error: 'Chat locked due to repeated violations', locked: true });
      }
    }

    const msg = new Message({
      orderId, sender, senderName, receiver, receiverName,
      message,
      messageType: message?.startsWith('IMAGE_DATA:') ? 'image' : message?.startsWith('FILE_DATA:') ? 'file' : 'text',
      isFlagged, flagReason,
    });
    await msg.save();

    // Update conversation
    const participants = [String(sender), String(receiver)].filter(Boolean);
    await Conversation.findOneAndUpdate(
      { orderId },
      { $set: { lastMessage: message, updatedAt: new Date() }, $addToSet: { participants: { $each: participants } }, $inc: { unreadCount: 1 } },
      { upsert: true, new: true }
    );

    // Broadcast to room
    io.to(orderId).emit('receive_message', { message: msg });

    const response = { message: msg };
    if (isFlagged) response.aiStatus = 'DISPUTE';
    if (warnings) response.warnings = warnings;
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('register_user', async (userId) => {
    await UserSocket.findOneAndUpdate(
      { userId: String(userId) },
      { socketId: socket.id, updatedAt: new Date() },
      { upsert: true }
    );
    console.log(`👤 Registered: ${userId} → ${socket.id}`);
  });

  socket.on('join_chat', (orderId) => {
    socket.join(orderId);
    console.log(`✅ Joined room: ${orderId}`);
  });

  socket.on('leave_chat', (orderId) => {
    socket.leave(orderId);
  });

  socket.on('send_message', (msg) => {
    io.to(msg.orderId).emit('receive_message', msg);
  });

  socket.on('notify_message', async (msg) => {
    io.to(msg.orderId).emit('receive_message', msg);
    const rec = await UserSocket.findOne({ userId: String(msg.receiver) });
    if (rec?.socketId) {
      io.to(rec.socketId).emit('new_message_notification', {
        orderId: msg.orderId,
        senderName: msg.senderName || msg.sender,
        message: msg.message,
      });
      console.log(`✅ Notification sent to ${msg.receiver}`);
    } else {
      console.log(`⚠️ Receiver ${msg.receiver} not registered`);
    }
  });

  socket.on('disconnect', async () => {
    await UserSocket.deleteOne({ socketId: socket.id });
    console.log('🔴 Disconnected:', socket.id);
  });
});

const PORT = 5001;
httpServer.listen(PORT, '0.0.0.0', () => console.log(`Chat server running on http://0.0.0.0:${PORT}`));
