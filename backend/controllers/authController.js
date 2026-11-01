import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { fallbackAdmin } from '../config/inMemoryStore.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'sweet_cake_house_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Fallback if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      if (cleanEmail === fallbackAdmin.email) {
        const isMatch = await bcrypt.compare(password, fallbackAdmin.passwordHash);
        if (isMatch) {
          const token = generateToken(fallbackAdmin._id);
          return res.json({
            success: true,
            token,
            admin: {
              id: fallbackAdmin._id,
              name: fallbackAdmin.name,
              email: fallbackAdmin.email,
              role: fallbackAdmin.role,
            },
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id || req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin credentials (email / password)
// @route   PUT /api/auth/credentials
// @access  Private (Admin)
export const updateCredentials = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const adminId = req.admin._id || req.admin.id;

    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update password in offline mode.',
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    if (currentPassword && newPassword) {
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      admin.password = newPassword;
    }

    if (email && email.trim()) {
      admin.email = email.toLowerCase().trim();
    }

    await admin.save();

    res.json({
      success: true,
      message: 'Admin credentials updated successfully!',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
