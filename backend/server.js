require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const portfolioRoutes = require('./routes/portfolio');
const ordersRoutes = require('./routes/orders');
const moneyRoutes = require('./routes/money');
const marketRoutes = require('./routes/market');
const stopLossRoutes = require('./routes/stopLoss');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Apply rate limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/money', moneyRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/stop-loss', stopLossRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const { startStopLossMonitor } = require('./jobs/stopLossMonitor');
const { startPriceAlertMonitor } = require('./jobs/priceAlertMonitor');

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 ProStock Backend running on http://localhost:${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  
  // Start background jobs
  startStopLossMonitor();
  startPriceAlertMonitor();
  logger.info('✅ Background monitoring jobs started');
});

module.exports = app;
