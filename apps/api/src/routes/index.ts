import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import internalRouter from './internal.routes.js';
import dietPlanRouter from './dietPlan.routes.js';
import adminRouter from './admin.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/internal', internalRouter);
router.use('/diet-plans', dietPlanRouter);
router.use('/admin', adminRouter);

export default router;
