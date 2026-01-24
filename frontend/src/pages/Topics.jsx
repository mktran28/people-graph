import {useEffect, useState } from "react";
import * as topicsApi from '../api/topics.api.js'
import {Link} from 'react-router-dom';
import {unwrapList, getErrorMessage} from "../utils/api.js";
import {formatDateTime} from "../utils/date.js";

export default function Topics() {
    const [query, setQuery] = useState("");
    const [topics, setTopics] = useState([]);
    const [selected, setSelected] = useState("");
    const [people, setPeople] = useState([]);
    const [error, setError] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [loadingPeople, setLoadingPeople] = useState(false);

    async function loadTopics(query) {
        setError("");
        setLoadingTopics(true);

        try {
            const data = await topicsApi.listTopics(query);
            setTopics(unwrapList(data, ["topics"]));
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoadingTopics(false)
        }
    }

    async function loadPeople(topic) {
        setError("");
        setLoadingPeople(true);

        try {
            const data = await topicsApi.peopleForTopic(topic);
            setPeople(unwrapList(data, ["people"]));
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoadingPeople(false);
        }
    }

    useEffect(() => {
        const time = setTimeout(() => loadTopics(query), 250);
        return () => clearTimeout(time);
    }, [query]);

    async function handleSelect(topicName) {
        setSelected(topicName);
        setPeople([]);
        await loadPeople(topicName);
    }

    return (
        <div className = "space-y-4">
            <div>
                <h1 className = "text-2xl font-bold">Topics</h1>
                <div className = "text-sm opacity-70">Pick a topic</div>
            </div>

            {error && <div className = "text-red-600">{error}</div>}

            <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className = "border rounded-xl p-4 space-y-3">
                    <div className = "font-semibold">Search topics</div>
                    <input 
                        className = "w-full border rounded-xl px-3 py-2"
                        value = {query}
                        onChange = {(e) => setQuery(e.target.value)}
                        placeholder = "e.g., school"
                    />

                    {loadingTopics ? (
                        <div className = "text-sm opacity-70">Loading topics...</div>
                    ) : topics.length === 0 ? (
                        <div className = "text-sm opacity-70">No topics found</div>
                    ) : (
                        <ul className = "space-y-2">
                            {topics.map((t) => (
                                <li key = {t.id}>
                                    <button disabled = {loadingTopics} onClick = {() => handleSelect(t.name)} className = {`text-left w-full px-3 py-2 rounded-xl border ${selected === t.name ? "bg-black text-white" : ""}`}>{t.name}</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className = "border rounded-xl p-4 space-y-3">
                    <div className = "font-semibold">{selected ? `People you have discussed "${selected}" with:` : "Select a topic"}</div>

                    {selected && loadingPeople ? (
                        <div className = "text-sm opacity-70">Loading people...</div>
                    ) : !selected ? (
                        <div className = "text-sm opacity-70">Choose a topic on the left</div>
                    ) : people.length === 0 ? (
                        <div className = "text-sm opacity-70">No matches</div>
                    ) : (
                        <ul className = "space-y-2">
                            {people.map((p) => (
                                <li key = {p.id} className = "border rounded-xl p-3">
                                    <Link to = {`/people/${p.id}`} className = "font-semibold hover:underline">{p.name}</Link>
                                    <div className = "text-sm opacity-70">{p.category || "uncategorized"} | priority {p.priority}</div>
                                    <div className = "text-sm opacity-70 mt-1">Matches: {p.matching_interactions ?? "?"} | Last topic chat:{" "}{p.last_topic_interaction_at ? formatDateTime(p.last_topic_interaction_at) : "unknown"}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}