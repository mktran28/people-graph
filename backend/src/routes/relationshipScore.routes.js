import {Router} from 'express';
import {getPersonScoreHandler} from '../controllers/relationshipScore.controller.js';

const router = Router();

router.get("/people/:id/score", getPersonScoreHandler);

export default router;