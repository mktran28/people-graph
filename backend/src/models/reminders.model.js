import pool from '../db/index.js';

export async function getDueReminders(user_id) {
    const result = await pool.query(
        `
        SELECT
            p.*,
            MAX(i.occurred_at) AS last_interaction_at,
            rs.snoozed_until,
            rs.dismissed_until
        FROM people p
        LEFT JOIN interactions i
            ON i.person_id = p.id AND i.user_id = p.user_id
        LEFT JOIN reminder_states rs
            ON rs.person_id = p.id AND rs.user_id = p.user_id
        WHERE p.user_id = $1
        GROUP BY p.id, rs.snoozed_until, rs.dismissed_until
        HAVING
            (
                MAX(i.occurred_at) IS NULL
                OR MAX(i.occurred_at) < NOW() - (p.contact_frequency_days || ' days')::INTERVAL
            )
                AND (rs.snoozed_until IS NULL OR rs.snoozed_until <= NOW())
                AND (rs.dismissed_until IS NULL OR rs.dismissed_until <= NOW())
        ORDER BY
            p.priority ASC,
            COALESCE(MAX(i.occurred_at), p.created_at) ASC
        `,
        [user_id]
    );

    return result.rows;
}