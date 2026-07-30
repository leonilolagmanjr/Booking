/**
 * CourtFlow — Database Connection
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[CourtFlow] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[CourtFlow] MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

