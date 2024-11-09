
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myapp', { 
    });
    console.log('Connected to database');
  } catch (error) {
    console.error("error:",error);
  }
};

export default connectDB;