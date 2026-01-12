import pool from '../db/index.js';

export async function createPerson(user_id, {name, category, notes, contact_frequency_days, priority}) {
    const result = await pool.query(
        `
        INSERT INTO people (user_id, name, category, notes, contact_frequency_days, priority) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
        `,
        [user_id, name, category, notes, contact_frequency_days, priority]
    );

    return result.rows[0];
}

export async function getAllPeople(user_id) {
    const result = await pool.query(
        `
        SELECT 
            p.*,
            MAX(i.occurred_at) AS last_interaction_at
        FROM people p
        LEFT JOIN interactions i
            ON i.person_id = p.id AND i.user_id = p.user_id
        WHERE p.user_id = $1
        GROUP BY p.id
        ORDER BY COALESCE(MAX(i.occurred_at), p.created_at) DESC
        `,
        [user_id]
    );

    return result.rows;
}

export async function getPersonById(user_id, person_id) {
    const result = await pool.query(
        `
        SELECT
            p.*,
            MAX(i.occurred_at) AS last_interaction_at,
            COUNT(i.id) AS interaction_count
        FROM people p
        LEFT JOIN interactions i
            ON i.person_id = p.id AND i.user_id = p.user_id
        WHERE p.id = $1 AND p.user_id = $2
        GROUP BY p.id
        `,
        [person_id, user_id]
    );

    return result.rows[0] || null;
}

export async function updatePerson(user_id, person_id, {name, category, notes, contact_frequency_days, priority}) {
    const result = await pool.query(
        `
        UPDATE people
        SET name = $1,
            category = $2,
            notes = $3,
            contact_frequency_days = $4,
            priority = $5
        WHERE id = $6 AND user_id = $7
        RETURNING *
        `,
        [name, category, notes, contact_frequency_days, priority, person_id, user_id]
    );

    return result.rows[0] || null;
}

export async function deletePerson(user_id, person_id) {
    const result = await pool.query(
        `
        DELETE FROM people
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [person_id, user_id]
    );

    return result.rows[0] || null;
}

export async function getPersonSummary(user_id, person_id) {
    const personResult = await pool.query(
        `
        SELECT
            p.*,
            MAX(i.occurred_at) AS last_interaction_at,
            COUNT(i.id) AS interaction_count
        FROM people p
        LEFT JOIN interactions i
            ON i.person_id = p.id AND i.user_id = p.user_id
        WHERE p.id = $1 AND p.user_id = $2
        GROUP BY p.id
        `,
        [person_id, user_id]
    );

    const person = personResult.rows[0] || null;

    if (!person) {
        return null;
    }

    const interactionsResult = await pool.query(
        `
        SELECT *
        FROM interactions
        WHERE person_id = $1 AND user_id = $2
        ORDER BY occurred_at DESC
        LIMIT 10
        `,
        [person_id, user_id]
    );

    return {person, recent_interactions: interactionsResult.rows};
}

export async function personBelongsToUser(userId, person_id) {
    const result = await pool.query(
        `
        SELECT 1 FROM people 
        WHERE id = $1 AND user_id = $2
        `,
        [person_id, userId]
    );

    return result.rowCount > 0;
}