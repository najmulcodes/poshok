import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import internalRouter from './internal.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter); // For the /me endpoint
router.use('/internal', internalRouter);

export default router;