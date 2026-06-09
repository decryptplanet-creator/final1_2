const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory message store (keyed by orderId)
const messages = {};

app.get('/api/messages/:orderId', (req, res) => {
  res.json(messages[req.params.orderId] || []);
});

app.post('/api/messages', (req, res) => {
  const msg = { ...req.body, id: Date.now().toString() };
  const orderId = msg.orderId;
  if (!messages[orderId]) messages[orderId] = [];
  messages[orderId].push(msg);
  res.json(msg);
});

io.on('connection', (socket) => {
  socket.on('join_chat', (orderId) => socket.join(orderId));
  socket.on('leave_chat', (orderId) => socket.leave(orderId));
  socket.on('send_message', (msg) => {
    socket.to(msg.orderId).emit('receive_message', msg);
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => console.log(`Chat server running on http://localhost:${PORT}`));
