const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Place order (BUY or SELL)
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { symbol, name, exchange, type, quantity, price } = req.body;
    const userId = req.user.userId;

    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({ error: 'Invalid quantity or price' });
    }

    const total = quantity * price;

    await connection.beginTransaction();

    // Get current balance
    const [users] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw new Error('User not found');
    }

    let newBalance = parseFloat(users[0].balance);

    if (type === 'BUY') {
      // Check sufficient balance
      if (total > newBalance) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      newBalance -= total;

      // Update or insert portfolio
      const [existing] = await connection.query(
        'SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (existing.length > 0) {
        const holding = existing[0];
        const totalQty = holding.quantity + quantity;
        const totalValue = (holding.avg_price * holding.quantity) + total;
        const newAvgPrice = totalValue / totalQty;

        await connection.query(
          'UPDATE portfolio SET quantity = ?, avg_price = ?, current_price = ? WHERE id = ?',
          [totalQty, newAvgPrice, price, holding.id]
        );
      } else {
        await connection.query(
          'INSERT INTO portfolio (user_id, symbol, name, exchange, quantity, avg_price, current_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userId, symbol, name, exchange || 'NSE', quantity, price, price]
        );
      }
    } else {
      // SELL
      const [holdings] = await connection.query(
        'SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (holdings.length === 0 || holdings[0].quantity < quantity) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient holdings' });
      }

      const holding = holdings[0];
      newBalance += total;

      if (holding.quantity === quantity) {
        await connection.query('DELETE FROM portfolio WHERE id = ?', [holding.id]);
      } else {
        await connection.query(
          'UPDATE portfolio SET quantity = ?, current_price = ? WHERE id = ?',
          [holding.quantity - quantity, price, holding.id]
        );
      }
    }

    // Update user balance
    await connection.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [newBalance, userId]
    );

    // Insert order record
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, symbol, name, exchange, order_type, quantity, price, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, symbol, name, exchange || 'NSE', type, quantity, price, total, 'COMPLETED']
    );

    // Insert transaction record
    const balanceBefore = parseFloat(users[0].balance);
    await connection.query(
      'INSERT INTO transactions (user_id, tx_type, amount, balance_before, balance_after, description) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, total, balanceBefore, newBalance, `${type} ${quantity} shares of ${symbol}`]
    );

    // Create notification
    await connection.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, `${type === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol} for ₹${total.toFixed(2)}`, type]
    );

    await connection.commit();

    res.json({
      message: `Order ${type} executed successfully`,
      orderId: orderResult.insertId,
      newBalance
    });
  } catch (error) {
    await connection.rollback();
    console.error('[ORDER ERROR]', error);
    res.status(500).json({ error: 'Failed to execute order' });
  } finally {
    connection.release();
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
