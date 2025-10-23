const express = require('express');
const axios = require('axios');

const router = express.Router();

// Yahoo Finance API endpoint (using RapidAPI)
const YAHOO_API_KEY = process.env.YAHOO_FINANCE_API_KEY;
const YAHOO_API_BASE = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock';

// Cache for stock prices (10 minutes)
let priceCache = {};
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Get stock quotes for multiple symbols
router.get('/stocks', async (req, res) => {
  try {
    const { symbols } = req.query; // Comma-separated: RELIANCE.NS,TCS.NS

    if (!symbols) {
      return res.status(400).json({ error: 'Symbols parameter required' });
    }

    const symbolList = symbols.split(',').map(s => s.trim());

    // Check cache
    const now = Date.now();
    if (cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      const cachedData = symbolList.map(symbol => priceCache[symbol]).filter(Boolean);
      if (cachedData.length === symbolList.length) {
        return res.json({
          stocks: cachedData,
          source: 'cache',
          cachedAt: new Date(cacheTimestamp).toISOString()
        });
      }
    }

    // Fetch from Yahoo Finance (using .NS suffix for NSE stocks)
    const stockPromises = symbolList.map(async (symbol) => {
      try {
        // Add .NS if not present (for NSE stocks)
        const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
        
        const response = await axios.get(`${YAHOO_API_BASE}/quote/${yahooSymbol}`, {
          headers: {
            'X-RapidAPI-Key': YAHOO_API_KEY,
            'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
          }
        });

        const data = response.data;
        
        return {
          symbol: symbol.replace('.NS', ''),
          name: data.longName || data.shortName || symbol,
          price: data.regularMarketPrice || 0,
          change: data.regularMarketChange || 0,
          percent_change: data.regularMarketChangePercent || 0,
          timestamp: new Date().toISOString()
        };
      } catch (err) {
        console.error(`Failed to fetch ${symbol}:`, err.message);
        return null;
      }
    });

    const results = await Promise.all(stockPromises);
    const validResults = results.filter(Boolean);

    // Update cache
    validResults.forEach(stock => {
      priceCache[stock.symbol] = stock;
    });
    cacheTimestamp = now;

    res.json({
      stocks: validResults,
      source: 'api',
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[MARKET DATA ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Clear cache manually (admin endpoint)
router.post('/cache/clear', (req, res) => {
  priceCache = {};
  cacheTimestamp = null;
  res.json({ message: 'Cache cleared' });
});

module.exports = router;
