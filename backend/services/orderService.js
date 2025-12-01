const pool = require('../config/database');
const FinancialMath = require('../utils/financialMath');
const logger = require('../config/logger');

async function executeOrder(userId, symbol, name, exchange, type, quantity, price) {
  const connection = await pool.getConnection();
  
  try {
    // Validation
    if (!['BUY', 'SELL'].includes(type)) {
      throw new Error('Invalid order type');
    }

    if (!FinancialMath.isPositive(quantity) || !FinancialMath.isPositive(price)) {
      throw new Error('Invalid quantity or price');
    }

    // Calculate total using Decimal.js for accuracy
    const total = FinancialMath.multiply(quantity, price);

    await connection.beginTransaction();
    logger.debug('Order execution started', { userId, symbol, type, quantity, price, total });

    // Get current balance
    const [users] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw new Error('User not found');
    }

    let newBalance = parseFloat(users[0].balance);
    const currentBalance = newBalance;

    if (type === 'BUY') {
      // Check sufficient balance
      if (FinancialMath.compare(total, newBalance) > 0) {
        logger.warn('Insufficient balance for BUY order', { userId, required: total, available: newBalance });
        throw new Error('Insufficient balance');
      }

      newBalance = FinancialMath.subtract(newBalance, total);

      // Update or insert portfolio
      const [existing] = await connection.query(
        'SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (existing.length > 0) {
        const holding = existing[0];
        const totalQty = FinancialMath.add(holding.quantity, quantity);
        const newAvgPrice = FinancialMath.weightedAverage(
          holding.quantity,
          holding.avg_price,
          quantity,
          price
        );

        await connection.query(
          'UPDATE portfolio SET quantity = ?, avg_price = ?, current_price = ?, invested_amount = ? WHERE id = ?',
          [
            totalQty, 
            FinancialMath.round(newAvgPrice), 
            FinancialMath.round(price), 
            FinancialMath.round(FinancialMath.multiply(totalQty, newAvgPrice)),
            holding.id
          ]
        );
        logger.debug('Portfolio updated', { userId, symbol, newQty: totalQty, newAvgPrice });
      } else {
        await connection.query(
          'INSERT INTO portfolio (user_id, symbol, name, exchange, quantity, avg_price, current_price, invested_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            userId, 
            symbol, 
            name, 
            exchange || 'NSE', 
            quantity, 
            FinancialMath.round(price), 
            FinancialMath.round(price),
            FinancialMath.round(total)
          ]
        );
        logger.debug('New portfolio entry created', { userId, symbol, quantity, price });
      }
    } else {
      // SELL
      const [holdings] = await connection.query(
        'SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (holdings.length === 0 || FinancialMath.compare(holdings[0].quantity, quantity) < 0) {
        logger.warn('Insufficient holdings for SELL order', { userId, symbol, required: quantity, available: holdings[0]?.quantity || 0 });
        throw new Error('Insufficient holdings');
      }

      const holding = holdings[0];
      newBalance = FinancialMath.add(newBalance, total);

      if (holding.quantity === quantity) {
        await connection.query('DELETE FROM portfolio WHERE id = ?', [holding.id]);
        logger.debug('Portfolio entry deleted (sold all)', { userId, symbol });
      } else {
        const remainingQty = FinancialMath.subtract(holding.quantity, quantity);
        const newInvestedAmount = FinancialMath.multiply(remainingQty, holding.avg_price);
        
        await connection.query(
          'UPDATE portfolio SET quantity = ?, current_price = ?, invested_amount = ? WHERE id = ?',
          [
            remainingQty, 
            FinancialMath.round(price),
            FinancialMath.round(newInvestedAmount),
            holding.id
          ]
        );
        logger.debug('Portfolio updated after SELL', { userId, symbol, remainingQty });
      }
    }

    // Update user balance
    await connection.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [FinancialMath.round(newBalance), userId]
    );

    // Insert order record
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, symbol, name, exchange, order_type, quantity, price, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, symbol, name, exchange || 'NSE', type, quantity, FinancialMath.round(price), FinancialMath.round(total), 'COMPLETED']
    );

    // Insert transaction record
    await connection.query(
      'INSERT INTO transactions (user_id, tx_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
      [userId, type, FinancialMath.round(total), FinancialMath.round(newBalance), `${type} ${quantity} shares of ${symbol}`]
    );

    // Create notification
    await connection.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, `${type === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol} for ${FinancialMath.formatCurrency(total)}`, type]
    );

    await connection.commit();
    
    logger.info('Order executed successfully', { 
      userId, 
      orderId: orderResult.insertId, 
      symbol, 
      type, 
      quantity, 
      price, 
      total,
      balanceChange: FinancialMath.subtract(newBalance, currentBalance)
    });

    return {
      orderId: orderResult.insertId,
      newBalance: FinancialMath.round(newBalance)
    };
  } catch (error) {
    await connection.rollback();
    logger.error('Order execution failed', { 
      userId, 
      symbol, 
      type, 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  executeOrder
};
