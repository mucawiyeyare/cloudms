// =====================================================
// AUTH ROUTES - Admin Login & Seed
// POST /api/auth/login
// POST /api/auth/seed (create initial admin)
// =====================================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/seed
// @desc    Create the default admin account (run once)
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists.' });
    }
    const admin = new Admin({ username: 'admin', password: 'admin123' });
    await admin.save();
    res.status(201).json({ message: '✅ Admin account created. Username: admin, Password: admin123' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Admin Login - returns a JWT token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Fadlan geli magacaaga iyo eraygaaga sirta ah.' });
  }

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Magacaaga ama eraygaaga sirta khalad.' });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Magacaaga ama eraygaaga sirta khalad.' });
    }

    // Create JWT payload and sign token
    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      message: 'Ku soo dhowow Dashboard-ka!',
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/auth/register
// @desc    Admin Register - create a new user (public for signup)
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Fadlan geli magaca iyo erayga sirta ah.' });
  }

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Magacaan waa la isticmaalayaa.' });
    }

    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ message: '✅ Isticmaalaha cusub si guul leh ayaa loo abuuray!' });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: 'Server Error: ' + err.message, error: err.message });
  }
});

module.exports = router;
