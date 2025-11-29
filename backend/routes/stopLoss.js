const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

// Get all stop loss orders for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM stop_loss_orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ stopLossOrders: orders });
  } catch (error) {
    console.error('Error fetching stop loss orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new stop loss order
router.post('/', authenticateToken, async (req, res) => {
  const { symbol, name, triggerPrice, quantity } = req.body;

  if (!symbol || !triggerPrice || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verify user has enough quantity in portfolio
    const [portfolio] = await pool.query(
      'SELECT quantity FROM portfolio WHERE user_id = ? AND symbol = ?',
      [req.user.id, symbol]
    );

    if (portfolio.length === 0 || portfolio[0].quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings for stop loss' });
    }

    // Check if total locked quantity (including other active stop losses) exceeds holding
    const [activeStopLosses] = await pool.query(
      'SELECT SUM(quantity) as locked_qty FROM stop_loss_orders WHERE user_id = ? AND symbol = ? AND status = "PENDING"',
      [req.user.id, symbol]
    );

    const lockedQty = (activeStopLosses[0].locked_qty || 0);
    if (portfolio[0].quantity < (lockedQty + quantity)) {
      return res.status(400).json({ 
        message: `Insufficient available holdings. You have ${portfolio[0].quantity} shares, but ${lockedQty} are already locked in other stop loss orders.` 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO stop_loss_orders (user_id, symbol, name, trigger_price, quantity) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, symbol, name, triggerPrice, quantity]
    );

    const [newOrder] = await pool.query('SELECT * FROM stop_loss_orders WHERE id = ?', [result.insertId]);

    res.status(201).json({ 
      message: 'Stop loss order created successfully', 
      order: newOrder[0] 
    });
  } catch (error) {
    console.error('Error creating stop loss order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a stop loss order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE stop_loss_orders SET status = "CANCELLED" WHERE id = ? AND user_id = ? AND status = "PENDING"',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or already processed' });
    }

    res.json({ message: 'Stop loss order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling stop loss order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
