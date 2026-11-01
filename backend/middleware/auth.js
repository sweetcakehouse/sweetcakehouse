import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { fallbackAdmin } from '../config/inMemoryStore.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.',
      });
    }

    const secret = process.env.JWT_SECRET || 'sweet_cake_house_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    if (mongoose.connection.readyState !== 1) {
      if (decoded.id === fallbackAdmin._id) {
        req.admin = fallbackAdmin;
        return next();
      }
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: Admin account not found.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: ' + (error.message || 'Token verification failed'),
    });
  }
};
