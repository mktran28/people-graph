import pool from '../db/index.js';

export async function snoozePerson(user_id, person_id, days) {
    const result = await pool.query(
        `
        INSERT INTO reminder_states (user_id, person_id, snoozed_until, updated_at)
        VALUES ($1, $2, NOW() + ($3 || ' days')::INTERVAL, NOW())
        ON CONFLICT (person_id)
        DO UPDATE SET
            user_id = EXCLUDED.user_id,
            snoozed_until = EXCLUDED.snoozed_until,
            updated_at = NOW()
        RETURNING *
        `,
        [user_id, person_id, days]
    );

    return result.rows[0];
}

export async function dismissPerson(user_id, person_id, days) {
    const result = await pool.query(
        `
        INSERT INTO reminder_states (user_id, person_id, dismissed_until, updated_at)
        VALUES ($1, $2, NOW() + ($3 || ' days')::INTERVAL, NOW())
        ON CONFLICT (person_id)
        DO UPDATE SET
            user_id = EXCLUDED.user_id,
            dismissed_until = EXCLUDED.dismissed_until,
            updated_at = NOW()
        RETURNING *
        `,
        [user_id, person_id, days]
    );

    return result.rows[0];
}