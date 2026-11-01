import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getProducts).post(protectAdmin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

export default router;

