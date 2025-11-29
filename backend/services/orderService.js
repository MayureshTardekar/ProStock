const pool = require('../config/database');

async function executeOrder(userId, symbol, name, exchange, type, quantity, price) {
  const connection = await pool.getConnection();
  
  try {
    if (!['BUY', 'SELL'].includes(type)) {
      throw new Error('Invalid order type');
    }

    if (quantity <= 0 || price <= 0) {
      throw new Error('Invalid quantity or price');
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
        throw new Error('Insufficient balance');
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
        throw new Error('Insufficient holdings');
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

    return {
      orderId: orderResult.insertId,
      newBalance
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  executeOrder
};
