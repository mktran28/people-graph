import pool from '../db/index.js';

export async function createInteraction(user_id, {person_id, type, occurred_at, notes}) {
    const result = await pool.query(
        `
        INSERT INTO interactions (user_id, person_id, type, occurred_at, notes)
        VALUES ($1, $2, $3, COALESCE($4, NOW()), $5)
        RETURNING *
        `,
        [user_id, person_id, type, occurred_at, notes]
    );

    return result.rows[0];
}

export async function getAllInteractions(user_id, person_id) {
    const result = await pool.query(
        `
        SELECT * FROM interactions
        WHERE person_id = $1 AND user_id = $2
        `,
        [person_id, user_id]
    );

    return result.rows;
}

export async function updateInteraction(user_id, interaction_id, {type, occurred_at, notes}) {
    const result = await pool.query(
        `
        UPDATE interactions
        SET type = $1,
            occurred_at = COALESCE($2, occurred_at),
            notes = $3
        WHERE id = $4 AND user_id = $5
        RETURNING *
        `,
        [type, occurred_at, notes, interaction_id, user_id]
    );

    return result.rows[0] || null;
}

export async function deleteInteraction(user_id, interaction_id) {
    const result = await pool.query(
        `
        DELETE FROM interactions
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [interaction_id, user_id]
    );

    return result.rows[0] || null;
}

export async function getRecentInteractionsForPerson(user_id, person_id, limit = 200) {
    const result = await pool.query(
        `
        SELECT type, occurred_at FROM interactions
        WHERE person_id = $1 AND user_id = $2
        ORDER BY occurred_at DESC
        LIMIT $3
        `,
        [person_id, user_id, limit]
    );

    return result.rows;
}

export async function getRecentInteractionsForPeople(user_id, person_ids, limitPerPerson = 50) {
    if (!person_ids || person_ids.length === 0) {
        return [];
    }

    console.log("person_ids typeof:", typeof person_ids, "value:", person_ids);


    const result = await pool.query(
        `
        SELECT *
        FROM (
            SELECT
                i.*,
                ROW_NUMBER() OVER (
                        PARTITION BY person_id 
                        ORDER BY occurred_at DESC
                    ) 
                    AS rn
            FROM interactions i
            WHERE i.user_id = $1 AND i.person_id = ANY($2::int[])
        ) t
         WHERE t.rn <= $3
         ORDER BY person_id, occurred_at DESC
        `,
        [user_id, person_ids, limitPerPerson]
    );

    return result.rows;
}

export async function setInteractionTopics(interactionId, topicNames = []) {
    const cleanedTopicNames = topicNames.filter(topic => typeof topic === "string").map(topic => topic.trim().toLowerCase()).filter(topic => topic.length > 0);

    await pool.query(
        `
        DELETE FROM interaction_topics 
        WHERE interaction_id = $1
        `,
        [interactionId]
    );

    if (cleanedTopicNames.length === 0) {
        return [];
    }

    const topicRows = []

    for (const name of cleanedTopicNames) {
        const topicResult = await pool.query(
            `
            INSERT INTO topics (name)
            VALUES ($1)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id, name
            `,
            [name]
        );

        topicRows.push(topicResult.rows[0]);
    }

    for (const topic of topicRows) {
        await pool.query(
            `
            INSERT INTO interaction_topics (interaction_id, topic_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            `,
            [interactionId, topic.id]
        );
    }

    return topicRows;
}

export async function getTopicsForInteraction(interactionId) {
    const result = await pool.query(
        `
        SELECT t.*
        FROM interaction_topics it
        JOIN topics t ON t.id = it.topic_id
        WHERE it.interaction_id = $1
        ORDER BY t.name ASC
        `,
        [interactionId]
    );

    return result.rows;
}