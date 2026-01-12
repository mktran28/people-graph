CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE interaction_topics (
    interaction_id INTEGER NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (interaction_id, topic_id)
);

CREATE INDEX idx_topics_name ON topics (name);
CREATE INDEX idx_interaction_topics_topic_id ON interaction_topics (topic_id);