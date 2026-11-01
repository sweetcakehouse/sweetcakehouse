import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet_cake_house';
    console.log(`[Database] Attempting connection to MongoDB...`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.log(`[Database Note] Please ensure your MongoDB Atlas URI or local MongoDB is running.`);
    console.log(`[Database Note] To configure MongoDB Atlas, set MONGODB_URI in backend/.env file.`);
    // Return null or let caller handle fallback if applicable
    return null;
  }
};

export default connectDB;

