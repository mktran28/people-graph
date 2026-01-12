import pool from '../src/db/index.js';
import bcrypt from "bcrypt";

async function seed() {
    console.log("Seeding...");

    await pool.query("DELETE FROM interaction_topics");
    await pool.query("DELETE FROM topics");
    await pool.query("DELETE FROM daily_reminders");
    await pool.query("DELETE FROM daily_reminder_runs");
    await pool.query("DELETE FROM reminder_states");
    await pool.query("DELETE FROM interactions");
    await pool.query("DELETE FROM people");
    await pool.query("DELETE FROM users");

    const email = "demo@example.com";
    const password = "password123";
    const hash = await bcrypt.hash(password, 12);

    const userResult = await pool.query(
        `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email
        `,
        [email, hash]
    );

    const user_id = userResult.rows[0].id;
    console.log("Created demo user:", userResult.rows[0], "password:", password);

    const peopleData = [
        {name: "Anne", category: "friend", contact_frequency_days: 7, priority: 1, notes: "close friend"},
        {name: "Benjamin", category: "work", contact_frequency_days: 14, priority: 2, notes: "coworker"},
        {name: "Charlotte", category: "family", contact_frequency_days: 30, priority: 1, notes: "cousin"},
        {name: "Declan", category: "work", contact_frequency_days: 60, priority: 3, notes: "met at a conference"},
    ];

    const people = [];

    for (const p of peopleData) {
        const result = await pool.query(
            `
            INSERT INTO people (user_id, name, category, contact_frequency_days, priority, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [user_id, p.name, p.category, p.contact_frequency_days, p.priority, p.notes]
        );

        people.push(result.rows[0]);
    }

    const topics = ["startups", "career", "fitness", "family"];

    for (const t of topics) {
        await pool.query(
            `
            INSERT INTO topics (name)
            VALUES ($1)
            ON CONFLICT (name) DO NOTHING
            `,
            [t]
        );
    }

    async function addInteraction(person_id, type, occurred_at, notes, topicNames = []) {
        const interactionResult = await pool.query(
            `
            INSERT INTO interactions (user_id, person_id, type, occurred_at, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [user_id, person_id, type, occurred_at, notes]
        );

        const interaction = interactionResult.rows[0]

        for (const name of topicNames) {
            const topicResult = await pool.query(
                `
                SELECT id FROM topics
                WHERE name = $1
                `,
                [name]
            );

            if (topicResult.rows[0]) {
                await pool.query(
                    `
                    INSERT INTO interaction_topics (interaction_id, topic_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                    `,
                    [interaction.id, topicResult.rows[0].id]
                );
            }
        }

        return interaction;
    }

    const now = new Date();
    const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

    await addInteraction(people[0].id, "meeting", daysAgo(3), "Coffee catch-up", ["startups", "career"]);
    await addInteraction(people[0].id, "message", daysAgo(1), "Quick check-in", ["fitness"]);
    await addInteraction(people[1].id, "call", daysAgo(20), "Talked about job search", ["career"]);
    await addInteraction(people[2].id, "message", daysAgo(40), "Family updates", ["family"]);
    await addInteraction(people[3].id, "message", daysAgo(90), "Conference follow-up", ["startups"]);

    console.log("Seed complete");

    await pool.end();
}

seed().catch((err) => {
    console.error("Seed failed: ", err);
    process.exit(1);
});