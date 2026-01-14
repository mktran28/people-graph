import {Router} from 'express';
import {runDailyRemindersHandler, getTodayRemindersHandler} from '../controllers/dailyReminders.controller.js';
// import {requireCronSecret} from '../middlewares/cronAuth.middleware.js';
import {requireAuth} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/today", requireAuth, getTodayRemindersHandler);
// router.post("/run", requireCronSecret, runDailyRemindersHandler);
router.post("/run", requireAuth, runDailyRemindersHandler);

export default router;