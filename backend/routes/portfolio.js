const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user portfolio
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [holdings] = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = ? ORDER BY invested_amount DESC',
      [userId]
    );

    const portfolio = holdings.map(h => ({
      symbol: h.symbol,
      name: h.name,
      exchange: h.exchange,
      quantity: h.quantity,
      avgPrice: parseFloat(h.avg_price),
      currentPrice: parseFloat(h.current_price),
      investedAmount: parseFloat(h.invested_amount),
      lastUpdated: h.last_updated
    }));

    res.json({ portfolio });
  } catch (error) {
    console.error('[GET PORTFOLIO ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

module.exports = router;
