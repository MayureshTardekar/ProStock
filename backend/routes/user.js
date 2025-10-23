const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id/profile', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Ensure user can only access their own profile
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [users] = await pool.query(
      'SELECT id, full_name, email, balance, profile_json, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      balance: parseFloat(user.balance),
      profile: user.profile_json ? JSON.parse(user.profile_json) : {},
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('[GET PROFILE ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/:id/profile', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { fullName, profileData } = req.body;

    const updates = [];
    const values = [];

    if (fullName) {
      updates.push('full_name = ?');
      values.push(fullName);
    }

    if (profileData) {
      updates.push('profile_json = ?');
      values.push(JSON.stringify(profileData));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('[UPDATE PROFILE ERROR]', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
