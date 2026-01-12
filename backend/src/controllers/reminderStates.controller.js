import {snoozePerson, dismissPerson} from '../models/reminderStates.model.js';
import {personBelongsToUser} from "../models/people.model.js";

function parseDays(value, fallback) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    const n = Number(value);

    if (Number.isNaN(n) || n < 1 || n > 3650) {
        return null;
    }

    return Math.floor(n);
}

export async function snoozePersonHandler(req, res) {
    try {
        const person_id = Number(req.params.person_id);

        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "person_id must be a number"});
        }

        const days = parseDays(req.body?.days, 7);

        if (days === null) {
            return res.status(400).json({error: "days must be a number between 1 and 3650"});
        }

        const ok = await personBelongsToUser(req.user.id, person_id);

        if (!ok) {
            return res.status(404).json({error: "Person not found"});
        }

        const state = await snoozePerson(req.user.id, person_id, days);

        res.json({message: "Snoozed", state});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to snooze reminder" });
    }
}

export async function dismissPersonHandler(req, res) {
    try {
        const person_id = Number(req.params.person_id);

        if (Number.isNaN(person_id)) {
            return res.status(400).json({error: "person_id must be a number"});
        }

        const days = parseDays(req.body?.days, 30);
        if (days === null) {
            return res.status(400).json({error: "days must be a number between 1 and 3650"});
        }

        const ok = await personBelongsToUser(req.user.id, person_id);

        if (!ok) {
            return res.status(404).json({error: "Person not found"});
        }

        const state = await dismissPerson(req.user.id, person_id, days);

        res.json({message: "Dismissed", state});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to dismiss reminder" });
    }
}