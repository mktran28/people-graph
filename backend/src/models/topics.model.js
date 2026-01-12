import pool from '../db/index.js';

export async function createTopicIfNotExists(name) {
    const result = await pool.query(
        `
        INSERT INTO topics (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING *
        `,
        [name.trim().toLowerCase()]
    );

    return result.rows[0];
}

export async function getAllTopics() {
    const result = await pool.query(
        `
        SELECT * FROM topics ORDER BY name ASC
        `
    );

    return result.rows;
}

export async function searchTopics(q) {
    const result = await pool.query(
        `
        SELECT * FROM topics
        WHERE name ILIKE $1
        ORDER BY name ASC
        LIMIT 20
        `,
        [`%${q}%`]
    );

    return result.rows;
}