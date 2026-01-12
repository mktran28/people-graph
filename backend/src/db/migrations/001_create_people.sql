CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    notes TEXT,
    contact_frequency_days INTEGER NOT NULL DEFAULT 30,
    priority INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT contact_frequency_days_range CHECK (contact_frequency_days BETWEEN 1 AND 3650),
    CONSTRAINT priority_range CHECK (priority BETWEEN 1 AND 3)
);