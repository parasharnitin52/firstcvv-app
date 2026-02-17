const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cvs');
const smartRoutes = require('./routes/smart');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

// Import models to ensure they sync
require('./models/UserTemplateUnlock');

const app = express();
const path = require('path');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    // Sync models
    // remove { force: true } in production, it drops tables!
    // using { alter: true } updates tables to match models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/smart', smartRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FirstCV API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
