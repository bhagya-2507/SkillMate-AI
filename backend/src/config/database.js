const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillmate_ai';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected successfully via Mongoose: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Mongoose connection error:', error.message);
    return false;
  }
};

module.exports = {
  connectDB,
  mongoose
};
