import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  submitUtr,
  deleteOrder,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order stats for admin overview
router.get('/stats/overview', protectAdmin, getDashboardStats);

// List orders (admin) and Create order (customer)
router.route('/').get(protectAdmin, getOrders).post(createOrder);

// Customer submits UTR/screenshot after payment
router.put('/:id/utr', submitUtr);

// Admin status and payment updates
router.put('/:id/status', protectAdmin, updateOrderStatus);
router.put('/:id/payment', protectAdmin, updatePaymentStatus);

// Single order details and deletion
router.route('/:id').get(getOrderById).delete(protectAdmin, deleteOrder);

export default router;

