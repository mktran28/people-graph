import {computeRelationshipScore} from '../services/relationshipScore.service.js';
import {getRecentInteractionsForPerson} from '../models/interactions.model.js';
import {getPersonById} from '../models/people.model.js';

export async function getPersonScoreHandler(req, res) {
    try {
        const person_id = Number(req.params.id);

        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const halfLifeDaysRaw = req.query.halfLifeDays ?? "30";
        const halfLifeDays = Number(halfLifeDaysRaw);

        if (Number.isNaN(halfLifeDays) || halfLifeDays < 1 || halfLifeDays > 3650) {
            return res.status(400).json({error: "halfLifeDays must be between 1 and 3650"});
        }

        const exists = await getPersonById(req.user.id, person_id);

        if (!exists) {
            return res.status(404).json({error: "Person not found"});
        }

        const interactions = await getRecentInteractionsForPerson(req.user.id, person_id, 200);
        const score = computeRelationshipScore(interactions, halfLifeDays);

        res.json({
            person_id: person_id,
            half_life_days: halfLifeDays,
            interaction_count_used: interactions.length,
            score,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to compute relationship score"});
    }
}