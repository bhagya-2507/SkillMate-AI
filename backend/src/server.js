const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/database');
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require('./models'); // Ensure models are loaded

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('❌ MongoDB connection failed. Please ensure MongoDB service is running (port 27017).');
    }

    const server = app.listen(PORT, () => {
      console.log(`
=====================================================
🚀 SkillMate Backend Server Running (Mongoose + Express)
📡 Port: ${PORT}
🌐 Base API: http://localhost:${PORT}/api
🩺 Health Check: http://localhost:${PORT}/api/health
=====================================================
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received. Closing HTTP server...');
      server.close(() => {
        console.log('HTTP server closed.');
      });
    });

  } catch (error) {
    console.error('❌ Server startup failure:', error);
    process.exit(1);
  }
};

startServer();
