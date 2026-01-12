import {Router} from 'express';
import {runDailyRemindersHandler, getTodayRemindersHandler} from '../controllers/dailyReminders.controller.js';
import {requireCronSecret} from '../middlewares/cronAuth.middleware.js';

const router = Router();

router.get("/today", getTodayRemindersHandler);
router.post("/run", requireCronSecret, runDailyRemindersHandler);

export default router;