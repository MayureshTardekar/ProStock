const mysql = require('mysql2/promise');
const logger = require('./logger');

// Validate required environment variables
const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error('Missing required environment variables', { missingVars });
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please ensure all required variables are set in .env file');
  process.exit(1);
}

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';

// Create connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: isProduction ? 20 : 10, // More connections in production
  queueLimit: 0, // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000, // 10 seconds
  timezone: '+05:30', // IST timezone
  // Performance optimizations
  multipleStatements: false, // Security: prevent SQL injection via multiple statements
  dateStrings: false, // Return dates as Date objects
  supportBigNumbers: true, // Support for BIGINT
  bigNumberStrings: false, // Return as numbers when safe
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ MySQL database connected successfully', {
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE,
      connectionLimit: isProduction ? 20 : 10
    });
    console.log('✅ MySQL database connected successfully');
    connection.release();
  } catch (error) {
    logger.error('❌ MySQL connection failed', { 
      error: error.message,
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE
    });
    console.error('❌ MySQL connection failed:', error.message);
    console.error('Please ensure MySQL is running and credentials are correct in .env file');
  }
})();

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected database pool error', { error: err.message, code: err.code });
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    logger.warn('Database connection lost, pool will reconnect automatically');
  }
});

module.exports = pool;
