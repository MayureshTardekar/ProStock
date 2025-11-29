const pool = require('../config/database');
const { getQuote } = require('../services/marketService');
const { executeOrder } = require('../services/orderService');

async function checkStopLossOrders() {
  try {
    // 1. Fetch all PENDING stop loss orders
    const [orders] = await pool.query(
      'SELECT * FROM stop_loss_orders WHERE status = "PENDING"'
    );

    if (orders.length === 0) return;

    console.log(`[StopLoss] Checking ${orders.length} pending orders...`);

    // 2. Group by symbol to batch price fetching
    const ordersBySymbol = orders.reduce((acc, order) => {
      if (!acc[order.symbol]) acc[order.symbol] = [];
      acc[order.symbol].push(order);
      return acc;
    }, {});

    // 3. Process each symbol
    for (const symbol of Object.keys(ordersBySymbol)) {
      try {
        const quote = await getQuote(symbol);
        if (!quote) {
          console.warn(`[StopLoss] Failed to fetch price for ${symbol}`);
          continue;
        }

        const currentPrice = quote.price;
        const symbolOrders = ordersBySymbol[symbol];

        for (const order of symbolOrders) {
          // Check if trigger condition is met (Current Price <= Trigger Price)
          if (currentPrice <= order.trigger_price) {
            console.log(`[StopLoss] Triggered for ${symbol} at ₹${currentPrice} (Trigger: ₹${order.trigger_price})`);
            
            // Execute SELL order
            try {
              await executeOrder(
                order.user_id,
                order.symbol,
                order.name,
                'NSE',
                'SELL',
                order.quantity,
                currentPrice
              );

              // Update stop loss order status
              await pool.query(
                'UPDATE stop_loss_orders SET status = "TRIGGERED", updated_at = NOW() WHERE id = ?',
                [order.id]
              );

              // Notify user (executeOrder already handles order notification, but we might want a specific one for Stop Loss)
              await pool.query(
                'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                [order.user_id, `Stop Loss triggered for ${order.symbol} at ₹${currentPrice}`, 'SYSTEM']
              );

            } catch (err) {
              console.error(`[StopLoss] Failed to execute order ${order.id}:`, err.message);
              // Optionally cancel the stop loss if execution fails (e.g., insufficient holdings due to manual sell)
              if (err.message === 'Insufficient holdings') {
                 await pool.query(
                  'UPDATE stop_loss_orders SET status = "CANCELLED", updated_at = NOW() WHERE id = ?',
                  [order.id]
                );
                await pool.query(
                  'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                  [order.user_id, `Stop Loss for ${order.symbol} cancelled due to insufficient holdings`, 'SYSTEM']
                );
              }
            }
          }
        }
      } catch (err) {
        console.error(`[StopLoss] Error processing symbol ${symbol}:`, err);
      }
    }
  } catch (error) {
    console.error('[StopLoss] Monitor error:', error);
  }
}

// Start the monitor
function startStopLossMonitor(intervalMs = 60000) {
  console.log('🛡️ Stop Loss Monitor started');
  // Run immediately
  checkStopLossOrders();
  // Set interval
  setInterval(checkStopLossOrders, intervalMs);
}

module.exports = { startStopLossMonitor };
