CREATE TABLE reminder_states (
    person_id INTEGER PRIMARY KEY REFERENCES people(id) ON DELETE CASCADE,
    snoozed_until TIMESTAMP,
    dismissed_until TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);