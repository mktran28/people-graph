CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_interactions_person_id_occurred_at
ON interactions (person_id, occurred_at DESC);