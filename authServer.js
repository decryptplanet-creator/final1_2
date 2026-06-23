require('dotenv').config();
const express    = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose   = require('mongoose');

const app        = express();
const httpServer = createServer(app);
const io         = new Server(httpServer, { cors: { origin: '*', methods: ['GET','POST'] } });

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── MongoDB ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillora_chat')
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Seed admin user if not exists
    const User = require('./models/User');
    const exists = await User.findOne({ role: 'admin' });
    if (!exists) {
      await User.create({ name: 'Admin User', email: 'admin@skillora.com', password: 'admin123', role: 'admin', verificationStatus: 'approved', status: 'active' });
      console.log('✅ Admin created: admin@skillora.com / admin123');
    }
  })
  .catch(e => console.error('❌ MongoDB error:', e.message));

// ── Auth + Admin Routes ────────────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ── Orders (unchanged, file-based) ────────────────────────────────────────────
const fs   = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, 'orders.json');
function loadOrders() {
  try { if (fs.existsSync(ORDERS_FILE)) return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch {}
  return [];
}
function saveOrders(data) {
  try { fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2)); } catch {}
}
let orders = loadOrders();

app.post('/api/orders', (req, res) => {
  const { title, description, budget, deadline, quantity, category, specifications } = req.body;
  if (!title || !budget || !deadline) return res.status(400).json({ error: 'Title, budget aur deadline zaroori hain' });
  const order = { _id: Date.now().toString(), title, description: description||'', budget: Number(budget), deadline, quantity: Number(quantity)||1, category: category||'', specifications: specifications||'', status: 'available', createdAt: new Date().toISOString() };
  orders.push(order); saveOrders(orders);
  res.json(order);
});

app.get('/api/orders/manufacturer', (req, res) => res.json({
  available: orders.filter(o => o.status === 'available'),
  accepted:  orders.filter(o => o.status === 'accepted'),
}));

app.get('/api/orders/labour', (req, res) => {
  const lo = orders.filter(o => o.type === 'labour');
  res.json({ available: lo.filter(o => o.status === 'open'), accepted: lo.filter(o => o.status === 'active') });
});

app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders/labour', (req, res) => {
  const { title, description, budget, deadline, quantity, postedBy } = req.body;
  if (!title || !budget || !deadline) return res.status(400).json({ error: 'Title, budget aur deadline zaroori hain' });
  const order = { _id: Date.now().toString(), type:'labour', title, description: description||'', budget: Number(budget), deadline, quantity: Number(quantity)||1, status:'open', applicants:[], hiredLabour:null, postedBy: postedBy||null, createdAt: new Date().toISOString() };
  orders.push(order); saveOrders(orders);
  res.json(order);
});

app.get('/api/orders/labour/mine', (req, res) => res.json(orders.filter(o => o.type === 'labour')));

app.post('/api/orders/labour/apply/:id', (req, res) => {
  const { labourId, labourName } = req.body;
  if (!labourId) return res.status(400).json({ error: 'labourId zaroori hai' });
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order nahi mila' });
  if (!order.applicants) order.applicants = [];
  if (order.applicants.some(a => a.labourId === labourId)) return res.status(409).json({ error: 'Aap pehle se apply kar chuke hain' });
  order.applicants.push({ labourId, labourName: labourName||labourId, appliedAt: new Date().toISOString(), status:'pending' });
  saveOrders(orders);

  // Manufacturer ke liye notification
  createNotification({
    title: 'New Labour Application',
    message: `${labourName || labourId} ne "${order.title}" order pe apply kiya hai. Review karein.`,
    type: 'labour_apply',
    userId: order.postedBy || null,
    meta: { orderId: order._id, orderTitle: order.title, labourId, labourName },
  });

  res.json({ success: true, order });
});

app.put('/api/orders/labour/hire/:id', async (req, res) => {
  const { labourId } = req.body;
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order nahi mila' });
  order.applicants = (order.applicants||[]).map(a => a.labourId === labourId ? { ...a, status:'hired' } : a);
  order.hiredLabour = labourId; order.status = 'active';
  saveOrders(orders);

  // Save notification for labour
  try {
    const Notification = require('./models/Notification');
    await Notification.create({
      title: '✅ Hire Ho Gaye!',
      message: `Mubarak! Aapko "${order.title}" order ke liye hire kar liya gaya hai.`,
      type: 'labour_apply',
      userId: String(labourId),
    });
  } catch (e) { console.error('Hire notification error:', e.message); }

  res.json({ success: true, order });
});

app.put('/api/orders/labour/reject/:id', async (req, res) => {
  const { labourId } = req.body;
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order nahi mila' });
  order.applicants = (order.applicants||[]).map(a => a.labourId === labourId ? { ...a, status:'rejected' } : a);
  saveOrders(orders);

  // Save notification for labour
  try {
    const Notification = require('./models/Notification');
    await Notification.create({
      title: '❌ Application Reject',
      message: `Afsos, "${order.title}" order ke liye aapki application reject ho gayi.`,
      type: 'labour_apply',
      userId: String(labourId),
    });
  } catch (e) { console.error('Reject notification error:', e.message); }

  res.json({ success: true, order });
});

// ── Reviews ────────────────────────────────────────────────────────────────────
app.put('/api/reviews/submit', async (req, res) => {
  const { reviewerId, receiverId, orderId, rating, comment } = req.body;
  if (!reviewerId||!receiverId||!orderId||!rating) return res.status(400).json({ error: 'Missing fields' });
  const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
  let reviews = [];
  try { if (fs.existsSync(REVIEWS_FILE)) reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE,'utf8')); } catch {}
  const idx = reviews.findIndex(r => r.reviewerId === reviewerId && r.orderId === orderId);
  const entry = { reviewerId, receiverId, orderId, rating: Number(rating), comment: comment||'', createdAt: new Date().toISOString() };
  if (idx >= 0) reviews[idx] = entry; else reviews.push(entry);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews,null,2));

  // Update trustScore in DB for receiverId
  try {
    const User = require('./models/User');
    const userReviews = reviews.filter(r => r.receiverId === receiverId);
    if (userReviews.length > 0) {
      const avg = userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length;
      const newScore = Math.round((avg / 5) * 100);
      await User.findByIdAndUpdate(receiverId, { trustScore: newScore });
    }
  } catch (e) { console.error('trustScore update error:', e.message); }

  res.json({ success: true });
});

// ── Stripe Escrow ──────────────────────────────────────────────────────────────
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.post('/api/escrow/stripe/initiate', async (req, res) => {
  try {
    const { orderId, amount, title } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Amount zaroori hai' });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', payment_method_types: ['card'],
      line_items: [{ price_data: { currency:'pkr', product_data:{ name: title||'Skillora Order Payment' }, unit_amount: Math.round(amount*100) }, quantity:1 }],
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url:  `http://localhost:5173/payment-cancel`,
    });
    const order = orders.find(o => o._id === orderId);
    if (order) { order.stripeSessionId = session.id; order.escrowStatus = 'awaiting_payment'; saveOrders(orders); }
    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/escrow/stripe/webhook', express.raw({ type:'application/json' }), (req, res) => {
  let event;
  try {
    event = process.env.STRIPE_WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
      : JSON.parse(req.body);
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const order = orders.find(o => o.stripeSessionId === event.data.object.id);
    if (order) { order.escrowStatus = 'paid'; saveOrders(orders); }
  }
  res.json({ received: true });
});

app.get('/api/escrow/verify/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const order = orders.find(o => o.stripeSessionId === req.params.sessionId);
    if (order && session.payment_status === 'paid') { order.escrowStatus = 'paid'; saveOrders(orders); }
    res.json({ status: session.payment_status, order: order||null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Socket.io (minimal, for escrow/order updates) ─────────────────────────────
const adminSockets = new Set();

io.on('connection', (socket) => {
  socket.on('register_user', (userId) => {
    socket._userId = userId;
    if (String(userId).startsWith('admin')) adminSockets.add(socket.id);
  });
  socket.on('join_chat', (room) => socket.join(room));
  socket.on('leave_chat', (room) => socket.leave(room));
  socket.on('send_message', (msg) => io.to(msg.orderId).emit('receive_message', msg));
  socket.on('disconnect', () => adminSockets.delete(socket.id));
});

// expose io for use in routes
app.set('io', io);
app.set('adminSockets', adminSockets);

// ── GPS Location Verification ──────────────────────────────────────────────────
app.post('/api/verify-location', async (req, res) => {
  try {
    const { latitude, longitude, enteredAddress } = req.body;
    const key = process.env.MAPS_API_KEY;
    if (!key) return res.status(500).json({ message: 'MAPS_API_KEY not set' });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results?.length) return res.json({ capturedAddress: '', locationVerified: false, message: 'Location not found' });

    const capturedAddress = data.results[0].formatted_address;
    const cityComponent = data.results[0].address_components?.find(c => c.types.includes('locality'));
    const capturedCity = cityComponent?.long_name?.toLowerCase() || '';
    const enteredCity = (enteredAddress || '').toLowerCase();
    const locationVerified = enteredCity ? enteredCity.includes(capturedCity) || capturedCity.includes(enteredCity) : true;

    res.json({ capturedAddress, locationVerified, message: locationVerified ? 'Location verified' : 'Address mismatch' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5003;
httpServer.listen(PORT, () => console.log(`✅ Auth server running on http://localhost:${PORT}`));
