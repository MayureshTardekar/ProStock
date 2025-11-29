const axios = require('axios');

// Providers
const YAHOO_API_KEY = process.env.YAHOO_FINANCE_API_KEY;
const YAHOO_API_HOST = 'yahoo-finance15.p.rapidapi.com';
const YAHOO_API_BASE = `https://${YAHOO_API_HOST}/api/v1/markets/stock`;
const TWELVE_API_KEY = process.env.TWELVE_DATA_API_KEY;
const TWELVE_API_BASE = 'https://api.twelvedata.com';

function normalizeSymbol(symbol) {
  return symbol.replace(/\.NS$/i, '').toUpperCase();
}

function parseYahooQuote(raw, fallbackName, symbol) {
  let d = raw;
  // Try common wrappers used by different endpoints/providers
  if (d && d.body && Array.isArray(d.body) && d.body.length) d = d.body[0];
  if (d && d.data && Array.isArray(d.data) && d.data.length) d = d.data[0];
  if (d && d.quoteResponse && Array.isArray(d.quoteResponse.result) && d.quoteResponse.result.length) {
    d = d.quoteResponse.result[0];
  }

  const price = Number(
    d?.regularMarketPrice ?? d?.ask ?? d?.bid ?? d?.previousClose ?? 0
  );
  const change = Number(
    d?.regularMarketChange ?? d?.regularMarketChangeRaw ?? 0
  );
  const percentChange = Number(
    d?.regularMarketChangePercent ?? d?.regularMarketChangePercentRaw ?? 0
  );

  return {
    symbol: normalizeSymbol(symbol),
    name: d?.longName || d?.shortName || fallbackName || normalizeSymbol(symbol),
    price: isNaN(price) ? 0 : price,
    change: isNaN(change) ? 0 : change,
    percent_change: isNaN(percentChange) ? 0 : percentChange,
    provider: 'yahoo',
    timestamp: new Date().toISOString(),
  };
}

async function fetchFromYahoo(symbol) {
  if (!YAHOO_API_KEY) throw new Error('Missing YAHOO_FINANCE_API_KEY');
  const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
  const url = `${YAHOO_API_BASE}/quote/${yahooSymbol}`;
  const { data } = await axios.get(url, {
    headers: {
      'X-RapidAPI-Key': YAHOO_API_KEY,
      'X-RapidAPI-Host': YAHOO_API_HOST,
    },
    timeout: 8000,
  });
  return parseYahooQuote(data, symbol, yahooSymbol);
}

async function fetchFromTwelve(symbol) {
  if (!TWELVE_API_KEY) throw new Error('Missing TWELVE_DATA_API_KEY');
  const twelveSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
  const { data } = await axios.get(`${TWELVE_API_BASE}/quote`, {
    params: { symbol: twelveSymbol, apikey: TWELVE_API_KEY },
    timeout: 8000,
  });
  if (data && data.status === 'error') throw new Error(data.message || 'Twelve Data error');
  const price = Number(data?.price ?? 0);
  const change = Number(data?.change ?? 0);
  const percentChange = Number(data?.percent_change ?? 0);
  return {
    symbol: normalizeSymbol(symbol),
    name: data?.name || normalizeSymbol(symbol),
    price: isNaN(price) ? 0 : price,
    change: isNaN(change) ? 0 : change,
    percent_change: isNaN(percentChange) ? 0 : percentChange,
    provider: 'twelvedata',
    timestamp: new Date().toISOString(),
  };
}

async function getQuote(symbol) {
  // Try Yahoo then Twelve Data
  try {
    return await fetchFromYahoo(symbol);
  } catch (e1) {
    console.warn(`[Yahoo] ${symbol} failed: ${e1.message}`);
    try {
      return await fetchFromTwelve(symbol);
    } catch (e2) {
      console.warn(`[TwelveData] ${symbol} failed: ${e2.message}`);
      return null;
    }
  }
}

module.exports = {
  getQuote,
  normalizeSymbol
};
