import {apiFetch} from "./client";

export function listTopics(query = "") {
    const queryString = query ? `?q=${encodeURIComponent(query)}` : "";
    return apiFetch(`/api/topics${queryString}`);
}

export function peopleForTopic(topic, limit = 20) {
    return apiFetch(`/api/topics/${encodeURIComponent(topic)}/people?limit=${limit}`);
}