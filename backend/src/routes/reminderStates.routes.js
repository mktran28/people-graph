import {Router} from 'express';
import {snoozePersonHandler, dismissPersonHandler} from '../controllers/reminderStates.controller.js';

const router = Router();

router.post("/:person_id/snooze", snoozePersonHandler);
router.post("/:person_id/dismiss", dismissPersonHandler);

export default router;