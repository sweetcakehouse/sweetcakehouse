import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      default: 'Sweet Cake House',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Handcrafted with Love, Baked to Perfection',
    },
    shopAddress: {
      type: String,
      default: 'Shop 14, Rose Villa Arcade, Baker Street, Blossom City',
    },
    city: {
      type: String,
      default: 'Mumbai',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    whatsappNumber: {
      type: String,
      default: '919876543210', // digits only with country code (e.g. 919876543210)
    },
    email: {
      type: String,
      default: 'orders@sweetcakehouse.com',
    },
    upiId: {
      type: String,
      default: 'sweetcakehouse@upi',
      trim: true,
    },
    upiHolderName: {
      type: String,
      default: 'Sweet Cake House Bakery',
      trim: true,
    },
    upiQrImage: {
      type: String,
      default: '', // can be a custom uploaded QR image URL
    },
    paymentInstructions: {
      type: String,
      default:
        '1. Scan the QR code or pay to the UPI ID directly.\n2. In the remarks/note, please write your Order ID.\n3. Enter the 12-digit UPI UTR / Ref Number below and submit your order.\n4. Our team will verify the payment and confirm your delivery!',
    },
    deliveryCharge: {
      type: Number,
      default: 50,
      min: 0,
    },
    freeDeliveryAbove: {
      type: Number,
      default: 999,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 200,
      min: 0,
    },
    businessHours: {
      type: String,
      default: '09:00 AM - 10:30 PM (Everyday)',
    },
    availableTimeSlots: {
      type: [String],
      default: [
        'Morning (09:00 AM - 01:00 PM)',
        'Afternoon (01:00 PM - 05:00 PM)',
        'Evening (05:00 PM - 09:00 PM)',
        'Midnight Special (11:00 PM - 12:00 AM)',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

