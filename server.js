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

app.get('/api/messages/:orderId', (req, res) => {
  res.json(messages[req.params.orderId] || []);
});

app.post('/api/messages', (req, res) => {
  const msg = { ...req.body, id: Date.now().toString() };
  const orderId = msg.orderId;
  if (!messages[orderId]) messages[orderId] = [];
  messages[orderId].push(msg);
  saveMessages(messages);
  res.json(msg);
});

io.on('connection', (socket) => {
  socket.on('join_chat', (orderId) => socket.join(orderId));
  socket.on('leave_chat', (orderId) => socket.leave(orderId));
  socket.on('send_message', (msg) => {
    // Broadcast to ALL in room (including sender) for 2-sided real-time
    io.to(msg.orderId).emit('receive_message', msg);
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => console.log(`Chat server running on http://localhost:${PORT}`));
