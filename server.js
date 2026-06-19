const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Persistent message store
const DB_FILE = path.join(__dirname, 'chat-messages.json');

function loadMessages() {
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch { }
  return {};
}

function saveMessages(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data), 'utf8'); } catch { }
}

const messages = loadMessages();

// ─── GET messages by orderId ──────────────────────────────────────────────────
app.get('/api/messages/:orderId', (req, res) => {
  res.json(messages[req.params.orderId] || []);
});

// ─── POST new message ─────────────────────────────────────────────────────────
app.post('/api/messages', (req, res) => {
  const now = new Date().toISOString();
  const msg = {
    ...req.body,
    _id: Date.now().toString(),      // ✅ _id add kiya (ChatModule use karta hai)
    id: Date.now().toString(),
    createdAt: now,                  // ✅ createdAt add kiya (time display ke liye)
    updatedAt: now,
  };

  const orderId = msg.orderId;
  if (!messages[orderId]) messages[orderId] = [];
  messages[orderId].push(msg);
  saveMessages(messages);

  // ✅ REST save ke baad socket se bhi broadcast karo
  io.to(orderId).emit('receive_message', { message: msg });

  res.json({ message: msg });        // ✅ { message: msg } format (ChatModule expect karta hai)
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_chat', (orderId) => {
    socket.join(orderId);
    console.log(`✅ Joined room: ${orderId}`);
  });

  socket.on('leave_chat', (orderId) => {
    socket.leave(orderId);
    console.log(`❌ Left room: ${orderId}`);
  });

  // ✅ send_message — socket se direct message
  socket.on('send_message', (msg) => {
    io.to(msg.orderId).emit('receive_message', msg);
  });

  // ✅ notify_message — ChatModule yeh emit karta hai REST save ke baad
  socket.on('notify_message', (msg) => {
    io.to(msg.orderId).emit('receive_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => console.log(`Chat server running on http://localhost:${PORT}`));