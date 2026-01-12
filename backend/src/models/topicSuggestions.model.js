import pool from '../db/index.js';

export async function getPeopleByTopic(user_id, topicName, limit = 20) {
    const result = await pool.query(
        `
        SELECT
            p.*,
            COUNT(i.id) AS matching_interactions,
            MAX(i.occurred_at) AS last_topic_interaction_at
        FROM topics t
        JOIN interaction_topics it ON it.topic_id = t.id
        JOIN interactions i ON  i.id = it.interaction_id
        JOIN people p ON p.id = i.person_id
        WHERE t.name = $1 AND p.user_id = $2 AND i.user_id = $2
        GROUP BY p.id
        ORDER BY MAX(i.occurred_at) DESC
        LIMIT $3
        `,
        [topicName.trim().toLowerCase(), user_id, limit]
    );

    return result.rows;
}