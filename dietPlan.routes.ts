import { Router } from 'express';
import { getPublishedDietPlans, getDietPlanById, subscribeToPlan, toggleFavoritePlan } from '../controllers/dietPlan.controller.js';
import { protect, optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', getPublishedDietPlans);
router.get('/:id', optionalAuth, getDietPlanById);

// A logged-in user can subscribe to a plan
router.post('/:id/subscribe', protect, subscribeToPlan);

// A logged-in user can favorite a plan
router.post('/:id/favorite', protect, toggleFavoritePlan);

export default router;