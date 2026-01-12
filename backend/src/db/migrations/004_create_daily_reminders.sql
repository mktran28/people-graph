CREATE TABLE daily_reminder_runs (
    run_date DATE PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_reminders (
    run_date DATE NOT NULL REFERENCES daily_reminder_runs(run_date) ON DELETE CASCADE,
    person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    last_interaction_at TIMESTAMP,
    priority INTEGER NOT NULL,
    contact_frequency_days INTEGER NOT NULL,
    relationship_score DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (run_date, person_id)
);