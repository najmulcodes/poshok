import { Router } from 'express';
import { getMe } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// This route is protected, meaning a user must be logged in to access it.
router.get('/me', protect, getMe);

export default router;