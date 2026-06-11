const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const app = express();
const httpServer = createServer(app);

// Add socket.io to prevent 404 errors
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// File-based user store
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch { }
  return {};
}

function saveUsers(data) {
  try { fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8'); } catch { }
}

const users = loadUsers();

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, cnic, dob, city } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password aur role zaroori hain' });
  }
  if (users[email]) {
    return res.status(409).json({ message: 'Yeh email pehle se registered hai' });
  }
  const id = Date.now().toString();
  const user = { id, name: name || '', email, role, cnic: cnic || '', dob: dob || '', city: city || '', verified: true };
  users[email] = { ...user, password };
  saveUsers(users);
  const token = Buffer.from(`${id}:${email}:${Date.now()}`).toString('base64');
  res.json({ token, user });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email aur password zaroori hain' });
  }
  const stored = users[email];
  if (!stored || stored.password !== password) {
    return res.status(401).json({ message: 'Email ya password galat hai' });
  }
  const { password: _, ...user } = stored;
  const token = Buffer.from(`${user.id}:${email}:${Date.now()}`).toString('base64');
  res.json({ token, user });
});

// ── Orders ─────────────────────────────────────────────────────────────────
const ORDERS_FILE = path.join(__dirname, 'orders.json');
function loadOrders() {
  try { if (fs.existsSync(ORDERS_FILE)) return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch { }
  return [];
}
function saveOrders(data) {
  try { fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2), 'utf8'); } catch { }
}
let orders = loadOrders();

// Post new order (manufacturer or client)
app.post('/api/orders', (req, res) => {
  const { title, description, budget, deadline, quantity, category, specifications } = req.body;
  if (!title || !budget || !deadline) return res.status(400).json({ error: 'Title, budget aur deadline zaroori hain' });
  const order = {
    _id: Date.now().toString(),
    title, description: description || '', budget: Number(budget),
    deadline, quantity: Number(quantity) || 1,
    category: category || '', specifications: specifications || '',
    status: 'available', createdAt: new Date().toISOString(),
  };
  orders.push(order);
  saveOrders(orders);
  res.json(order);
});

// Get orders for manufacturer (available + accepted)
app.get('/api/orders/manufacturer', (req, res) => {
  res.json({
    available: orders.filter(o => o.status === 'available'),
    accepted:  orders.filter(o => o.status === 'accepted'),
  });
});

// Get orders for labour
app.get('/api/orders/labour', (req, res) => {
  res.json({
    available: orders.filter(o => o.status === 'available'),
    accepted:  orders.filter(o => o.status === 'accepted'),
  });
});

// Get all users (for profiles)
app.get('/api/auth/users', (req, res) => {
  const role = req.query.role;
  const userList = Object.values(users).map(u => ({ 
    ...u, 
    _id: u.id,
    verified: true 
  }));
  
  if (role) {
    return res.json(userList.filter(u => u.role === role));
  }
  res.json(userList);
});

// Get all orders
app.get('/api/orders', (req, res) => res.json(orders));

// Labour accept offer
app.put('/api/orders/labour/accept/:id', (req, res) => {
  const orderId = req.params.id;
  const order = orders.find(o => o._id === orderId || o.id === orderId);
  if (!order) {
    // Create dummy order if not found (for frontend testing)
    const dummyOrder = {
      _id: orderId,
      id: orderId,
      title: 'Sample Order',
      status: 'accepted',
      budget: 1000,
      createdAt: new Date().toISOString()
    };
    orders.push(dummyOrder);
    saveOrders(orders);
    return res.json(dummyOrder);
  }
  order.status = 'accepted';
  saveOrders(orders);
  res.json(order);
});

// ── Stripe Escrow ──────────────────────────────────────────────────────────
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.post('/api/escrow/stripe/initiate', async (req, res) => {
  try {
    const { orderId, amount, title } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Amount zaroori hai' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'pkr',
          product_data: { name: title || 'Skillora Order Payment' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
    });

    // Save session id in order
    const order = orders.find(o => o._id === orderId || o.id === orderId);
    if (order) { order.stripeSessionId = session.id; order.escrowStatus = 'awaiting_payment'; saveOrders(orders); }

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/escrow/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      : JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionId = event.data.object.id;
    const order = orders.find(o => o.stripeSessionId === sessionId);
    if (order) { order.escrowStatus = 'paid'; saveOrders(orders); }
  }

  res.json({ received: true });
});

app.get('/api/escrow/verify/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const order = orders.find(o => o.stripeSessionId === req.params.sessionId);
    if (order && session.payment_status === 'paid') {
      order.escrowStatus = 'paid';
      saveOrders(orders);
    }
    res.json({ status: session.payment_status, order: order || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5003;
httpServer.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
