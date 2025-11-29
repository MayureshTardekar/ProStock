const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Get all active alerts for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [alerts] = await db.execute(
      'SELECT * FROM price_alerts WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Create a new price alert
router.post('/', authenticateToken, async (req, res) => {
  const { symbol, name, targetPrice, condition } = req.body;

  if (!symbol || !targetPrice || !condition) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['ABOVE', 'BELOW'].includes(condition)) {
    return res.status(400).json({ message: 'Invalid condition type' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO price_alerts (user_id, symbol, name, target_price, condition_type, status)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
      [req.user.id, symbol, name, targetPrice, condition]
    );

    const newAlert = {
      id: result.insertId,
      user_id: req.user.id,
      symbol,
      name,
      target_price: targetPrice,
      condition_type: condition,
      status: 'ACTIVE',
      created_at: new Date()
    };

    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// Delete/Cancel an alert
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Verify ownership
    const [alerts] = await db.execute(
      'SELECT * FROM price_alerts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (alerts.length === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await db.execute(
      'DELETE FROM price_alerts WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Alert cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling alert:', error);
    res.status(500).json({ message: 'Failed to cancel alert' });
  }
});

module.exports = router;
