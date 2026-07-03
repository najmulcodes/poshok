import { Router } from 'express';
import { getPublishedDietPlans, getDietPlanById, subscribeToPlan } from '../controllers/dietPlan.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/', getPublishedDietPlans);
router.get('/:id', getDietPlanById);

// A logged-in user can subscribe to a plan
router.post('/:id/subscribe', protect, subscribeToPlan);

export default router;