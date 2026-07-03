import { Router } from 'express';
import { dispatchNotifications } from '../controllers/notification.controller.js';
import { internalAuth } from '../middlewares/internalAuth.js';

const router = Router();

router.post('/dispatch-notifications', internalAuth, dispatchNotifications);

export default router;