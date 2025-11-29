const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const { executeOrder } = require('../services/orderService');

const router = express.Router();

// Place order (BUY or SELL)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { symbol, name, exchange, type, quantity, price } = req.body;
    const userId = req.user.userId;

    const result = await executeOrder(userId, symbol, name, exchange, type, quantity, price);

    res.json({
      message: `Order ${type} executed successfully`,
      orderId: result.orderId,
      newBalance: result.newBalance
    });
  } catch (error) {
    console.error('[ORDER ERROR]', error);
    if (error.message === 'Insufficient balance' || error.message === 'Insufficient holdings' || error.message === 'Invalid order type' || error.message === 'Invalid quantity or price' || error.message === 'User not found') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to execute order' });
  }
});

// Get user orders
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [userId]
    );

    const formattedOrders = orders.map(o => ({
      id: o.id,
      symbol: o.symbol,
      name: o.name,
      type: o.order_type,
      quantity: o.quantity,
      price: parseFloat(o.price),
      total: parseFloat(o.total),
      status: o.status,
      timestamp: o.created_at
    }));

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('[GET ORDERS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
