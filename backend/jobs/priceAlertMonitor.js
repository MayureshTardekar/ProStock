const db = require('../database/db');
const marketService = require('../services/marketService');

async function checkPriceAlerts() {
  console.log('Running Price Alert Monitor...');
  try {
    // Fetch all ACTIVE alerts
    const [alerts] = await db.execute(
      "SELECT * FROM price_alerts WHERE status = 'ACTIVE'"
    );

    if (alerts.length === 0) return;

    // Group by symbol to minimize API calls
    const symbols = [...new Set(alerts.map(a => a.symbol))];
    const prices = {};

    for (const symbol of symbols) {
      try {
        const quote = await marketService.getQuote(symbol);
        if (quote) {
          prices[symbol] = quote.price;
        }
      } catch (err) {
        console.error(`Failed to fetch price for ${symbol}:`, err.message);
      }
    }

    // Check conditions
    for (const alert of alerts) {
      const currentPrice = prices[alert.symbol];
      if (!currentPrice) continue;

      let triggered = false;
      if (alert.condition_type === 'ABOVE' && currentPrice >= alert.target_price) {
        triggered = true;
      } else if (alert.condition_type === 'BELOW' && currentPrice <= alert.target_price) {
        triggered = true;
      }

      if (triggered) {
        console.log(`Alert Triggered: ${alert.symbol} is ${alert.condition_type} ${alert.target_price}`);
        
        // Update alert status to TRIGGERED
        await db.execute(
          "UPDATE price_alerts SET status = 'TRIGGERED' WHERE id = ?",
          [alert.id]
        );

        // Create notification
        const message = `Price Alert: ${alert.symbol} has reached your target of ₹${alert.target_price}`;
        await db.execute(
          'INSERT INTO notifications (user_id, type, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())',
          [alert.user_id, 'ALERT', message, false]
        );
      }
    }
  } catch (error) {
    console.error('Error in Price Alert Monitor:', error);
  }
}

function startPriceAlertMonitor() {
  // Run every minute
  setInterval(checkPriceAlerts, 60 * 1000);
  console.log('Price Alert Monitor started');
}

module.exports = { startPriceAlertMonitor };
