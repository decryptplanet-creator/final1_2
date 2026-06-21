const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

const JWT_SECRET = process.env.JWT_SECRET || 'skillora_secret_key';
const sign = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, cnic, dob, city, affidavit, labourVideo } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: 'Email, password aur role zaroori hain' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Yeh email pehle se registered hai' });

    const user = await User.create({
      name: name || '', email, password, role: role.toLowerCase(),
      cnic: cnic || '', dob: dob || '', city: city || '',
      affidavit: affidavit || '', labourVideo: labourVideo || '',
    });

    // Admin notification: new registration
    await Notification.create({
      title: 'New User Registered',
      message: `New user registered: ${user.name || email} - role: ${user.role}`,
      type: 'registration',
      userId: user._id,
    });

    // Document notification if affidavit uploaded
    if (affidavit) {
      await Notification.create({
        title: 'Document Uploaded',
        message: `${user.name || email} (${user.role}) ne affidavit upload ki hai. Review required.`,
        type: 'document',
        userId: user._id,
      });
    }

    // Video notification if labour video uploaded
    if (labourVideo) {
      await Notification.create({
        title: 'Labour Verification Video Uploaded',
        message: `${user.name || email} (${user.role}) ne verification video upload ki hai. Manual review required.`,
        type: 'video',
        userId: user._id,
      });
    }

    const token = sign(user._id);
    const { password: _, ...userData } = user.toObject();
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email aur password zaroori hain' });

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ message: 'Email ya password galat hai' });

    const token = sign(user._id);
    const { password: _, ...userData } = user.toObject();
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
