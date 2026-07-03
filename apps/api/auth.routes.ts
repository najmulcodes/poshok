import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from 'shared';

const router = Router();

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 login requests per window
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: 'Too many login attempts, please try again after 15 minutes.',
});

router.post('/register', validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;