const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, balance) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, 100000.00]
    );

    const userId = result.insertId;

    // Create welcome transaction
    await pool.query(
      'INSERT INTO transactions (user_id, tx_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
      [userId, 'DEPOSIT', 100000.00, 100000.00, 'Welcome to ProStock! Paper trading account credited.']
    );

    // Generate JWT
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, fullName, email, balance: 100000.00 }
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT id, full_name, email, password_hash, balance FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        balance: parseFloat(user.balance)
      }
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
