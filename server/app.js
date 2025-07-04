const express = require('express');
const cors = require('cors');
require('dotenv').config();

const geminiRoutes = require('./routes/geminiRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// -------------------------
// 🔧 Middleware
// -------------------------
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend.netlify.app' // ✅ Replace with your actual Netlify domain
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------
// 📦 Routes
// -------------------------
app.use('/api/resume', geminiRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MyResume API is running',
    timestamp: new Date().toISOString()
  });
});

// -------------------------
// 🔁 Fallback for unknown routes
// -------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});


// -------------------------
// ❌ Global error handler
// -------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// -------------------------
// 🚀 Start server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MyResume API running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
