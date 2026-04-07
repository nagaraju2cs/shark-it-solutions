const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ── Security Headers ──────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ── Body Parser ───────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Sanitize NoSQL Injection ──────────────────
app.use(mongoSanitize());

// ── Compression ───────────────────────────────
app.use(compression());

// ── HTTP Logger ───────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Global Rate Limiter ───────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────
app.use('/api/v1/auth',     require('./routes/auth'));
app.use('/api/v1/contact',  require('./routes/contact'));
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/blog',     require('./routes/blog'));
app.use('/api/v1/reviews',  require('./routes/reviews'));
app.use('/api/v1/quotes',   require('./routes/quotes'));
app.use('/api/v1/admin',    require('./routes/admin'));

// ── Health Check ──────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shark IT Solutions API is running 🦈',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
