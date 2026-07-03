import { Router } from 'express';
import { getMe, updateHealthProfile, saveExpoPushToken, toggleMealCompletion, getFavoritePlans } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { healthProfileSchema } from 'shared';

const router = Router();

// All user routes are protected
router.use(protect);

router.get('/me', getMe);
router.patch('/me/health-profile', validate(healthProfileSchema), updateHealthProfile);
router.post('/me/push-token', saveExpoPushToken);
router.post('/me/completions', toggleMealCompletion);
router.get('/me/favorites', getFavoritePlans);

export default router;