const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_erp', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // Do not crash the entire process immediately in development so helpful error messages can be returned
    return null;
  }
};

module.exports = connectDB;

