require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const examResultRoutes = require('./routes/examResultRoutes');
const feeRoutes = require('./routes/feeRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'School Management ERP Backend API is operational',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examResultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

// Only start the server when run directly (not during unit testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[School ERP Server] Running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;

