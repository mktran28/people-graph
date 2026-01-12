import {getAllTopics, searchTopics} from "../models/topics.model.js";
import {getPeopleByTopic} from "../models/topicSuggestions.model.js";

export async function getTopicsHandler(req, res) {
    try {
        const q = req.query.q;
        const topics = q ? await searchTopics(String(q)) : await getAllTopics();
        res.json(topics);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch topics"});
    }
}

export async function getPeopleForTopicHandler(req, res) {
    try {
        const topic = req.params.topic;
        const limitRaw = req.query.limit ?? "20";
        const limit = Number(limitRaw);

        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({error: "topic is required"});
        }

        if (Number.isNaN(limit) || limit < 1 || limit > 200) {
            return res.status(400).json({error: "limit must be between 1 and 200"});
        }

        const people = await getPeopleByTopic(req.user.id, topic.trim(), limit);
        
        res.json({topic: topic.trim().toLowerCase(), count: people.length, people})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch topic suggestions"});
    }
}