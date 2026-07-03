import { Router } from 'express';
import { Role } from '@prisma/client';
import { createDietPlan, updateDietPlan, publishDietPlan, getAllDietPlans, getDietPlanByIdAdmin } from '../controllers/dietPlan.controller.js';
import { protect, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createDietPlanRefinedSchema, updateDietPlanSchema } from 'shared';

const router = Router();

// All routes in this file require ADMIN role
router.use(protect);
router.use(requireRole(Role.ADMIN));

// Diet Plan Management
router.get('/diet-plans', getAllDietPlans); // New endpoint for admin panel

router.post('/diet-plans', validate(createDietPlanRefinedSchema), createDietPlan);

router.get('/diet-plans/:id', getDietPlanByIdAdmin); // New endpoint for admin panel

router.patch('/diet-plans/:id', validate(updateDietPlanSchema), updateDietPlan);

router.post('/diet-plans/:id/publish', publishDietPlan);

export default router;