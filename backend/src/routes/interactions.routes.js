import {Router} from 'express';
import {createInteractionHandler, getInteractionsByPersonIdHandler, updateInteractionHandler, deleteInteractionHandler} from '../controllers/interactions.controller.js';

const router = Router();

router.post("/", createInteractionHandler);
router.get("/:person_id", getInteractionsByPersonIdHandler);
router.put("/:id", updateInteractionHandler);
router.delete("/:id", deleteInteractionHandler);

export default router;