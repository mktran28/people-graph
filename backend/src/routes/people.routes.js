import {Router} from 'express';
import {createPersonHandler, getAllPeopleHandler, getPersonByIdHandler, updatePersonHandler, deletePersonHandler} from '../controllers/people.controller.js';
import {getPersonSummaryHandler} from '../controllers/people.controller.js';

const router = Router();

router.post("/", createPersonHandler);
router.get("/", getAllPeopleHandler);
router.get("/:id", getPersonByIdHandler);
router.put("/:id", updatePersonHandler);
router.delete("/:id", deletePersonHandler);
router.get("/:id/summary", getPersonSummaryHandler);

export default router;