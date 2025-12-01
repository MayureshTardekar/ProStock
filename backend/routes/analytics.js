const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper to calculate analytics by replaying order history
function calculateAnalytics(orders) {
  const portfolio = {}; // { symbol: { quantity, avgPrice } }
  const trades = []; // { id, symbol, type, quantity, price, pnl, timestamp }
  
  let totalProfit = 0;
  let totalLoss = 0;
  let winningTrades = 0;
  let losingTrades = 0;

  // Process orders chronologically (Oldest first)
  orders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  orders.forEach(order => {
    const { symbol, order_type, quantity, price, total, created_at, id } = order;
    const qty = parseFloat(quantity);
    const unitPrice = parseFloat(price);
    const orderTotal = parseFloat(total);

    if (!portfolio[symbol]) {
      portfolio[symbol] = { quantity: 0, avgPrice: 0 };
    }

    if (order_type === 'BUY') {
      const currentQty = portfolio[symbol].quantity;
      const currentAvg = portfolio[symbol].avgPrice;
      
      const newQty = currentQty + qty;
      const newValue = (currentQty * currentAvg) + orderTotal;
      
      portfolio[symbol].quantity = newQty;
      portfolio[symbol].avgPrice = newValue / newQty;
    } 
    else if (order_type === 'SELL') {
      const currentAvg = portfolio[symbol].avgPrice;
      const costBasis = currentAvg * qty;
      const realizedPnL = orderTotal - costBasis;

      // Update stats
      if (realizedPnL > 0) {
        totalProfit += realizedPnL;
        winningTrades++;
      } else {
        totalLoss += Math.abs(realizedPnL);
        losingTrades++;
      }

      trades.push({
        id,
        symbol,
        type: 'SELL',
        quantity: qty,
        price: unitPrice,
        costBasis: currentAvg,
        pnl: realizedPnL,
        timestamp: created_at
      });

      // Update portfolio quantity (avg price doesn't change on sell)
      portfolio[symbol].quantity -= qty;
    }
  });

  const totalTrades = winningTrades + losingTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const netPnL = totalProfit - totalLoss;

  // Find Best and Worst trades
  trades.sort((a, b) => b.pnl - a.pnl); // Descending PnL
  const bestTrade = trades.length > 0 ? trades[0] : null;
  const worstTrade = trades.length > 0 ? trades[trades.length - 1] : null;

  return {
    overview: {
      netPnL,
      totalProfit,
      totalLoss,
      winRate,
      totalTrades,
      winningTrades,
      losingTrades
    },
    bestTrade,
    worstTrade,
    recentTrades: trades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50) // Newest first
  };
}

// GET /api/analytics/stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch ALL completed orders for the user
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? AND status = "COMPLETED"',
      [userId]
    );

    const analytics = calculateAnalytics(orders);

    res.json(analytics);
  } catch (error) {
    console.error('[ANALYTICS ERROR]', error);
    res.status(500).json({ error: 'Failed to calculate analytics' });
  }
});

// GET /api/analytics/pnl-history (For Charts)
router.get('/pnl-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? AND status = "COMPLETED"',
      [userId]
    );

    const portfolio = {}; 
    const history = []; // { date, pnl }
    
    // Group by date
    const pnlByDate = {};

    orders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    orders.forEach(order => {
      const { symbol, order_type, quantity, total, created_at } = order;
      const date = new Date(created_at).toISOString().split('T')[0];
      const qty = parseFloat(quantity);
      const orderTotal = parseFloat(total);

      if (!portfolio[symbol]) portfolio[symbol] = { quantity: 0, avgPrice: 0 };

      if (order_type === 'BUY') {
        const currentQty = portfolio[symbol].quantity;
        const currentAvg = portfolio[symbol].avgPrice;
        const newQty = currentQty + qty;
        const newValue = (currentQty * currentAvg) + orderTotal;
        portfolio[symbol].quantity = newQty;
        portfolio[symbol].avgPrice = newValue / newQty;
      } 
      else if (order_type === 'SELL') {
        const currentAvg = portfolio[symbol].avgPrice;
        const costBasis = currentAvg * qty;
        const realizedPnL = orderTotal - costBasis;

        pnlByDate[date] = (pnlByDate[date] || 0) + realizedPnL;
        portfolio[symbol].quantity -= qty;
      }
    });

    // Convert to array
    const chartData = Object.keys(pnlByDate).map(date => ({
      date,
      pnl: pnlByDate[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate cumulative PnL
    let cumulative = 0;
    const cumulativeData = chartData.map(item => {
      cumulative += item.pnl;
      return { ...item, cumulativePnL: cumulative };
    });

    res.json(cumulativeData);
  } catch (error) {
    console.error('[PNL HISTORY ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch PnL history' });
  }
});

module.exports = router;
