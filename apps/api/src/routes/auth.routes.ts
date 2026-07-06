import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from 'shared';

const router = Router();

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 login requests per window
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: 'Too many login attempts, please try again after 15 minutes.',
});

const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 10, // Limit each IP to 10 account creations per window
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: 'Too many accounts created from this IP, please try again later.',
});

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;