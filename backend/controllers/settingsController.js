import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import { fallbackSettings } from '../config/inMemoryStore.js';

// Helper to get or create settings singleton
export const getOrCreateSettings = async () => {
  if (mongoose.connection.readyState !== 1) {
    return fallbackSettings;
  }
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      shopName: 'Sweet Cake House',
      tagline: 'Handcrafted with Love, Baked to Perfection',
      shopAddress: 'Shop 14, Rose Villa Arcade, Baker Street, Blossom City',
      city: 'Mumbai',
      phone: '+91 98765 43210',
      whatsappNumber: '919876543210',
      email: 'orders@sweetcakehouse.com',
      upiId: 'sweetcakehouse@upi',
      upiHolderName: 'Sweet Cake House Bakery',
      upiQrImage: '',
      deliveryCharge: 50,
      freeDeliveryAbove: 999,
      minOrderAmount: 200,
      businessHours: '09:00 AM - 10:30 PM (Everyday)',
      availableTimeSlots: [
        'Morning (09:00 AM - 01:00 PM)',
        'Afternoon (01:00 PM - 05:00 PM)',
        'Evening (05:00 PM - 09:00 PM)',
        'Midnight Special (11:00 PM - 12:00 AM)',
      ],
    });
  }
  return settings;
};

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      Object.assign(fallbackSettings, req.body);
      return res.json({
        success: true,
        message: 'Store settings updated (memory mode)',
        settings: fallbackSettings,
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updated = await settings.save();
    res.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updated,
    });
  } catch (error) {
    next(error);
  }
};
