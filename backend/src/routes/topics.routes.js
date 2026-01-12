import {Router} from 'express';
import {getTopicsHandler, getPeopleForTopicHandler} from '../controllers/topics.controller.js';

const router = Router();

router.get("/", getTopicsHandler);
router.get("/:topic/people", getPeopleForTopicHandler);

export default router;