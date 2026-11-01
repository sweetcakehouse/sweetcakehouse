import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet_cake_house';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    const email = (process.env.ADMIN_EMAIL || 'admin@sweetcakehouse.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.ADMIN_NAME || 'Sweet Cake House Admin';

    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log(`Admin account with email '${email}' already exists. Updating password...`);
      admin.password = password; // pre-save hook will hash it
      await admin.save();
      console.log('✅ Admin password updated successfully.');
    } else {
      admin = new Admin({
        name,
        email,
        password,
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Admin account created successfully!');
    }

    console.log('-------------------------------------------');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log(`📧 Email:    ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
    process.exit(1);
  }
};

createAdmin();

