import {Router} from 'express';
import {getDueRemindersHandler} from '../controllers/reminders.controller.js';

const router = Router();

router.get("/", getDueRemindersHandler);

export default router;