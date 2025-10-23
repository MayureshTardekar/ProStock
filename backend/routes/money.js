const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const MAX_BALANCE = 5000000; // ₹50 lakh

// Add money (deposit)
router.post('/deposit', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await connection.beginTransaction();

    // Get current balance
    const [users] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const currentBalance = parseFloat(users[0].balance);
    const newBalance = currentBalance + amount;

    // Check max balance limit
    if (newBalance > MAX_BALANCE) {
      await connection.rollback();
      return res.status(400).json({ 
        error: `Maximum balance of ₹${MAX_BALANCE.toLocaleString('en-IN')} exceeded. You can add up to ₹${(MAX_BALANCE - currentBalance).toLocaleString('en-IN')}`
      });
    }

    // Update balance
    await connection.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [newBalance, userId]
    );

    // Insert transaction
    await connection.query(
      'INSERT INTO transactions (user_id, tx_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
      [userId, 'DEPOSIT', amount, newBalance, 'Added funds to account']
    );

    // Create notification
    await connection.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, `Added ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to your account`, 'DEPOSIT']
    );

    await connection.commit();

    res.json({
      message: 'Funds added successfully',
      newBalance
    });
  } catch (error) {
    await connection.rollback();
    console.error('[DEPOSIT ERROR]', error);
    res.status(500).json({ error: 'Failed to add funds' });
  } finally {
    connection.release();
  }
});

// Withdraw money
router.post('/withdraw', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await connection.beginTransaction();

    // Get current balance
    const [users] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const currentBalance = parseFloat(users[0].balance);

    if (amount > currentBalance) {
      await connection.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = currentBalance - amount;

    // Update balance
    await connection.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [newBalance, userId]
    );

    // Insert transaction
    await connection.query(
      'INSERT INTO transactions (user_id, tx_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
      [userId, 'WITHDRAW', amount, newBalance, 'Withdrew funds from account']
    );

    // Create notification
    await connection.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, `Withdrew ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} from your account`, 'WITHDRAW']
    );

    await connection.commit();

    res.json({
      message: 'Funds withdrawn successfully',
      newBalance
    });
  } catch (error) {
    await connection.rollback();
    console.error('[WITHDRAW ERROR]', error);
    res.status(500).json({ error: 'Failed to withdraw funds' });
  } finally {
    connection.release();
  }
});

// Get transactions
router.get('/transactions/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [transactions] = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [userId]
    );

    const formattedTxs = transactions.map(tx => ({
      id: tx.id,
      type: tx.tx_type,
      amount: parseFloat(tx.amount),
      balance: parseFloat(tx.balance_after),
      description: tx.description,
      timestamp: tx.created_at
    }));

    res.json({ transactions: formattedTxs });
  } catch (error) {
    console.error('[GET TRANSACTIONS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
