import {Link, useParams} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import * as personApi from "../api/people.api.js";
import * as interactionsApi from "../api/interactions.api.js";
import * as remindersApi from "../api/reminders.api.js";

function formatDate(d) {
    try {
        return new Date(d).toLocaleString();
    } catch {
        return String(d)
    }
}

export default function PersonDetail() {
    const {id} = useParams();
    const person_id = Number(id);

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [type, setType] = useState("message");
    const [notes, setNotes] = useState("");
    const [topics, setTopics] = useState("");
    const [saving, setSaving] = useState(false);

    async function load() {
        try {
            setError("");
            setLoading(true);

            const data = await personApi.getSummary(person_id);

            setSummary(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!Number.isNaN(person_id)) {
            load();
        }
    }, [person_id])

    async function handleAddInteraction(e) {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            const topicList = topics.split(",").map((t) => t.trim()).filter(Boolean);

            await interactionsApi.createInteraction({
                person_id: person_id,
                type,
                notes,
                topics: topicList,
            });

            await load();

            setNotes("");
            setTopics("");
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteInteraction(interaction_id) {
        setError("");

        try {
            await interactionsApi.deleteInteraction(interaction_id);
            await load();
        } catch (error) {
            setError(error.message);
        }
     }

     async function handleSnooze(days) {
        setError("");

        try {
            await remindersApi.snooze(person_id, days);
            await load();
        } catch (error) {
            setError(error.message);
        }
     }

     async function handleDismiss(days) {
        setError("");

        try {
            await remindersApi.dismiss(person_id, days);
            await load();
        } catch (error) {
            setError(error.message);
        }
     }

     if (Number.isNaN(person_id)) {
        return <div>Invalid person id.</div>
     }

     if (loading) {
        return <div>Loading person...</div>
     }

     if (error) {
        return <div className = "text-red-600">{error}</div>
     }

     if (!summary) {
        return <div>Not found.</div>
     }

     const {person, recent_interactions} = summary;

     return (
        <div className = "space-y-6">
            <div className = "text-sm opacity-70 flex items-center gap-2">
                <Link to = "/people" className = "hover:underline">← Back to people</Link>
            </div>

            <div className = "flex items-start justify-between gap-4">
                <div>

                    <h1 className = "text-2xl font-bold mt-1">{person.name}</h1>

                    <div className = "text-sm opacity-70">{person.category || "uncategorized"} | priority {person.priority} | Every {" "}{person.contact_frequency_days} days</div>
                
                    <div className = "text-sm mt-2">Relationship score:{" "}{person.score_half_life_days ? `half-life ${person.score_half_life_days}d` : null}</div>

                    <div className = "text-sm">Last interaction:{" "}{person.last_interaction_at ? formatDate(person.last_interaction_at): "never"}</div>
                </div>

                <div className = "flex flex-row gap-2">
                    <button className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleSnooze(7)}>Snooze</button>

                    <button className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleDismiss(30)}>Dismiss</button>
                </div>
            </div>

            {person.notes && (
                <div className = "border rounded-xl p-4">
                    <div className = "font-semibold mb-1">Notes</div>
                    <div className = "text-sm whitespace-wrap">{person.notes}</div>
                </div>
            )}

            <div className = "border rounded-xl p-4">
                <div className = "font-semibold mb-3">Recent interactions</div>

                {recent_interactions.length === 0 ? (
                    <div className = "text-sm opacity-70">No interactions yet.</div>
                ) : (
                    <ul className = "space-y-3">
                        {recent_interactions.map((it) => (
                            <li key = {it.id} className = "border rounded-xl p-3">
                                <div className = "flex items-start justify-between gap-3">
                                    <div>
                                        <div className = "text-sm font-semibold"> {it.type}{" "}{formatDate(it.occurred_at)}</div>

                                        {it.notes && (<div className = "text-sm mt-1 whitespace-pre-wrap">{it.notes}</div>)}
                                    </div>

                                    <button className = "text-xs px-2 py-1 rounded-xl border" onClick = {() => handleDeleteInteraction(it.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <form onSubmit = {handleAddInteraction} className = "border rounded-xl p-4 space-y-3">
                <div className = "font-semibold">Log interaction</div>

                <div className = "grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className = "block text-sm mb-1">Type</label>

                        <select className = "w-full border rounded-xl px-3 py-2" value = {type} onChange = {(e) => setType(e.target.value)}>
                            <option value = "message">Message</option>
                            <option value = "call">Call</option>
                            <option value = "meeting">Meeting</option>
                            <option value = "other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className = "block text-sm mb-1">Topics (comma-separated)</label>

                        <input 
                            className = "w-full border rounded-xl px-3 py-2" 
                            value = {topics} 
                            onChange = {(e) => setTopics(e.target.value)} 
                            placeholder = "e.g., school"/>
                    </div>
                </div>

                <div>
                    <label className = "block text-sm mb-1">Notes</label>
                    <textarea 
                        className = "w-full border rounded-xl px-3 py-2"
                        rows = {3}
                        value = {notes}
                        onChange = {(e) => setNotes(e.target.value)}
                        placeholder = "What did you talk about?"
                    />
                </div>

                <button className = "px-4 py-2 rounded-xl bg-black text-white disabled:opacity-70" disabled = {saving}>{saving ? "Saving..." : "Save interaction"}</button>
            </form>

            {error && <div className = "text-red-600">{error}</div>}
        </div>
     )
}