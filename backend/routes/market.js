const express = require('express');
const router = express.Router();
const { getQuote, normalizeSymbol } = require('../services/marketService');

// Cache for stock prices (short TTL for "live" feel)
let priceCache = {};
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

// GET /api/market/stocks?symbols=RELIANCE,TCS,HDFCBANK
router.get('/stocks', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) return res.status(400).json({ error: 'Symbols parameter required' });

    const symbolList = symbols.split(',').map((s) => normalizeSymbol(s.trim())).filter(Boolean);

    // Serve from cache if fresh and complete
    const now = Date.now();
    if (cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
      const cached = symbolList.map((s) => priceCache[s]).filter(Boolean);
      if (cached.length === symbolList.length) {
        return res.json({ stocks: cached, source: 'cache', cachedAt: new Date(cacheTimestamp).toISOString() });
      }
    }

    const results = await Promise.all(symbolList.map((s) => getQuote(s)));
    const valid = results.filter(Boolean);

    // Update cache for those we have
    valid.forEach((q) => {
      priceCache[q.symbol] = q;
    });
    cacheTimestamp = now;

    return res.json({ stocks: valid, source: 'api', fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[MARKET DATA ERROR]', error);
    return res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Admin: clear cache
router.post('/cache/clear', (req, res) => {
  priceCache = {};
  cacheTimestamp = null;
  res.json({ message: 'Cache cleared' });
});

module.exports = router;
