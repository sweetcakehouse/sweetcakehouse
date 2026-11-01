import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protectAdmin, getMe);

export default router;

