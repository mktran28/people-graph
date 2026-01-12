import {createPerson, getAllPeople, getPersonById, updatePerson, deletePerson, getPersonSummary} from '../models/people.model.js';
import {computeRelationshipScore} from '../services/relationshipScore.service.js';
import {getRecentInteractionsForPeople} from '../models/interactions.model.js';

function parseFrequencyDays(value, fallback = 30) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    const n = Number(value);

    if (Number.isNaN(n) || n < 1 || n > 3650) {
        return null;
    }

    return Math.floor(n);
}

function parsePriority(value, fallback = 2) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    const n = Number(value);

    if (Number.isNaN(n) || n < 1 || n > 3) {
        return null;
    }

    return Math.floor(n);
}

export async function createPersonHandler(req, res) {
    try {
        const {name, category, notes, contact_frequency_days, priority} = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({error: "name is required"});
        }

        const freq = parseFrequencyDays(contact_frequency_days, 30);
        
        if (freq === null) {
            return res.status(400).json({error: "contact_frequency_days must be a number between 1 and 3650"})
        }

        const pr = parsePriority(priority, 2);

        if (pr === null) {
            return res.status(400).json({error: "priority must be 1, 2, or 3"});
        }

        const person = await createPerson(req.user.id, {
            name: name.trim(),
            category: typeof category === "string" ? category.trim() : null,
            notes: typeof notes === "string" ? notes.trim(): null,
            contact_frequency_days: freq,
            priority: pr,
        });

        res.status(201).json(person);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to create person"});
    }
}

export async function getAllPeopleHandler(req, res) {
    try {
        const halfLifeDaysRaw = req.query.halfLifeDays ?? "30";
        const halfLifeDays = Number(halfLifeDaysRaw);

        if (Number.isNaN(halfLifeDays) || halfLifeDays <= 0 || halfLifeDays > 3650) {
            return res.status(400).json({ error: "halfLifeDays must be between 1 and 3650" });
        }

        const people = await getAllPeople(req.user.id);
        const ids = people.map(p => p.id);
        const interactions = await getRecentInteractionsForPeople(req.user.id, ids, 50);
        const byPerson = new Map();

        for (const it of interactions) {
            if (!byPerson.has(it.person_id)) {
                byPerson.set(it.person_id, [])
            };

            byPerson.get(it.person_id).push(it);
        }

        for (const p of people) {
            const list = byPerson.get(p.id) ?? [];
            
            p.relationship_score = computeRelationshipScore(list, halfLifeDays);
            p.score_half_life_days = halfLifeDays;
        }

        res.json(people);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch people"});
    }
}


export async function getPersonByIdHandler(req, res) {
    try {
        const {id} = req.params;

        const person_id = Number(id);
        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const person = await getPersonById(req.user.id, person_id);

        if (!person) {
            return res.status(404).json({error: "Person not found"});
        }

        res.json(person);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch person"});
    }
}

export async function updatePersonHandler(req, res) {
    try {
        const person_id = Number(req.params.id);

        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const {name, category, notes, contact_frequency_days, priority} = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({error: "name is required"});
        }

        const freq = parseFrequencyDays(contact_frequency_days, 30);
        
        if (freq === null) {
            return res.status(400).json({error: "contact_frequency_days must be a number between 1 and 3650"})
        }

        const pr = parsePriority(priority, 2);

        if (pr === null) {
            return res.status(400).json({error: "priority must be 1, 2, or 3"});
        }

        const updated = await updatePerson(req.user.id, person_id, {
            name: name.trim(),
            category: typeof category === "string" ? category.trim() : null,
            notes: typeof notes === "string" ? notes.trim() : null,
            contact_frequency_days: freq,
            priority: pr,
        });

        if (!updated) {
            return res.status(404).json({error: "Person not found"});
        }

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update person"});
    }
}

export async function deletePersonHandler(req, res) {
    try {
        const person_id = Number(req.params.id);

        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const deleted = await deletePerson(req.user.id, person_id);

        if (!deleted) {
            return res.status(404).json({error: "Person not found"});
        }

        res.json({message: "Person deleted", person: deleted})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to delete person"});
    }
}

export async function getPersonSummaryHandler(req, res) {
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
        
        const summary = await getPersonSummary(req.user.id, person_id);

        if (!summary) {
            return res.status(404).json({error: "Person not found"});
        }

        const score = computeRelationshipScore(summary.recent_interactions, halfLifeDays);

        summary.person.relationship_score = score;
        summary.person.score_half_life_days = halfLifeDays;

        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch person summary"});
    }
}