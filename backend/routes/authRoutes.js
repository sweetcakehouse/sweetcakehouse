import express from 'express';
import { login, getMe, updateCredentials } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.put('/credentials', protectAdmin, updateCredentials);

export default router;

