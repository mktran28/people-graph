import pool from '../db/index.js';
import {getDueReminders} from './reminders.model.js';
import {getRecentInteractionsForPeople} from './interactions.model.js';
import {computeRelationshipScore} from '../services/relationshipScore.service.js';

export async function runDailyReminders(user_id, runDate = null) {
    const dateResult = await pool.query(
        `
        SELECT COALESCE($1::date, CURRENT_DATE) AS d
        `,
        [runDate]
    );
    
    const d = dateResult.rows[0].d;

    await pool.query(
        `
        INSERT INTO daily_reminder_runs (run_date)
        VALUES ($1)
        ON CONFLICT (run_date) DO NOTHING
        `,
        [d]
    );

    await pool.query(
        `
        DELETE FROM daily_reminders 
        WHERE run_date = $1 AND user_id = $2
        `,
        [d, user_id]
    );

    const duePeople = await getDueReminders(user_id);
    const dueIds = duePeople.map(p => p.id);
    const interactions = await getRecentInteractionsForPeople(user_id, dueIds, 50);
    const byPerson = new Map();

    for (const it of interactions) {
        if (!byPerson.has(it.person_id)) {
            byPerson.set(it.person_id, []);
        }

        byPerson.get(it.person_id).push(it);
    }

    const halfLifeDays = 30;

    for (const p of duePeople) {
        const list = byPerson.get(p.id) ?? [];
        const score = computeRelationshipScore(list, halfLifeDays);

        await pool.query(
            `
            INSERT INTO daily_reminders (run_date, user_id, person_id, last_interaction_at, priority, contact_frequency_days, relationship_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (run_date, user_id, person_id) DO NOTHING
            `,
            [d, user_id, p.id, p.last_interaction_at, p.priority, p.contact_frequency_days, score]
        );
    }

    return {run_date: d, people: duePeople.length};
}

export async function getDailyReminders(user_id, runDate = null) {
    const dateResult = await pool.query(
        `
        SELECT COALESCE($1::date, CURRENT_DATE) AS d
        `,
        [runDate]
    );

    const d = dateResult.rows[0].d;

    const result = await pool.query(
        `
        SELECT
            p.*,
            dr.last_interaction_at,
            dr.relationship_score
        FROM daily_reminders dr
        JOIN people p ON p.id = dr.person_id
        WHERE dr.run_date = $1 AND dr.user_id = $2
        ORDER BY p.priority ASC, COALESCE(dr.last_interaction_at, p.created_at) ASC
        `,
        [d, user_id]
    );

    return {run_date: d, people: result.rows};
}