import {createInteraction, getAllInteractions, updateInteraction, deleteInteraction} from '../models/interactions.model.js';
import {setInteractionTopics, getTopicsForInteraction} from '../models/interactions.model.js';
import {personBelongsToUser} from '../models/people.model.js';

export async function createInteractionHandler(req, res) {
    try {
        const {person_id, type, occurred_at, notes} = req.body;
        
        if (!person_id || Number.isNaN(Number(person_id))) {
            return res.status(400).json({error: "person_id must be a number"});
        }

        if (!type || typeof type !== "string" || type.trim().length === 0) {
            return res.status(400).json({error: "type is required"})
        }

        const ok = await personBelongsToUser(req.user.id, Number(person_id));

        if (!ok) {
            return res.status(404).json({error: "Person not found"});
        }

        const interaction = await createInteraction(req.user.id, {
            person_id: Number(person_id),
            type: type.trim(),
            occurred_at: occurred_at ?? null,
            notes: typeof notes === "string" ? notes.trim() : null,
        });

        const topicNames = Array.isArray(req.body.topics) ? req.body.topics : [];
        const topics = await setInteractionTopics(interaction.id, topicNames);

        res.status(201).json({...interaction, topics});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to create interaction"});
    }
}

export async function getInteractionsByPersonIdHandler(req, res) {
    try {
        const {person_id} = req.params;

        const pid = Number(person_id);
        if (Number.isNaN(pid)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const ok = await personBelongsToUser(req.user.id, Number(person_id));

        if (!ok) {
            return res.status(404).json({error: "Person not found"});
        }

        const interactions = await getAllInteractions(req.user.id, pid);
        res.json(interactions);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch interactions"});
    }
}

export async function updateInteractionHandler(req, res) {
    try {
        const interaction_id = Number(req.params.id);

        if (Number.isNaN(interaction_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const {type, occurred_at, notes} = req.body;

        if (!type || typeof type !== "string" || type.trim().length === 0) {
            return res.status(400).json({ error: "type is required" });
        }

        const updated = await updateInteraction(req.user.id, interaction_id, {
            type: type.trim(),
            occurred_at: occurred_at ?? null,
            notes: typeof notes === "string" ? notes.trim() : null,
        });

        if (!updated) {
            return res.status(404).json({error: "Interaction not found"});
        }

        const topicNames = Array.isArray(req.body.topics) ? req.body.topics : [];
        const topics = await setInteractionTopics(updated.id, topicNames);

        res.json({ ...updated, topics });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update interaction"});
    }
}

export async function deleteInteractionHandler(req, res) {
    try {
        const interaction_id = Number(req.params.id);

        if (Number.isNaN(interaction_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const deleted = await deleteInteraction(req.user.id, interaction_id);

        if (!deleted) {
            return res.status(404).json({error: "Interaction not found"});
        }

        res.json({message: "Interaction deleted", interaction: deleted});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to delete interaction"});
    }
}