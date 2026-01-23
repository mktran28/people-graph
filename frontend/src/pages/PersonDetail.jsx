import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as peopleApi from "../api/people.api.js";
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
    const [editing, setEditing] = useState(false);
    const [logging, setLogging] = useState(false);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [editFrequency, setEditFrequency] = useState(30);
    const [editPriority, setEditPriority] = useState(2);
    const [savingPerson, setSavingPerson] = useState(false);

    async function load() {
        try {
            setError("");
            setLoading(true);

            const data = await peopleApi.getSummary(person_id);

            setSummary(data);

            const person = data.person;

            setEditName(person.name ?? "");
            setEditCategory(person.category ?? "");
            setEditNotes(person.notes ?? "");
            setEditFrequency(person.contact_frequency_days ?? 30);
            setEditPriority(person.priority ?? 2)
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

    useEffect(() => {
        const openModal = editing || logging;
        document.body.style.overflow = openModal ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [editing, logging])

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
            setLogging(false);
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

     async function handleSavePerson(e) {
        e.preventDefault();
        setError("");
        setSavingPerson(true);

        try {
            await peopleApi.updatePerson(person_id, {
                name: editName,
                category: editCategory,
                notes: editNotes,
                contact_frequency_days: Number(editFrequency),
                priority: Number(editPriority)
            });

            setEditing(false);
            await load();
        } catch (error) {
            setError(error.message);
        } finally {
            setSavingPerson(false);
        }
     }

     async function handleDeletePerson() {
        const ok = confirm("Delete this person? This will also delete their interactions.");

        if (!ok) {
            return;
        }

        setError("");

        try {
            await peopleApi.deletePerson(person_id);
            window.location.href = "/people";
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

     if (!summary) {
        return <div>Not found.</div>
     }

     const {person, recent_interactions} = summary;
     const busy = loading || saving || savingPerson;

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
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => setLogging(true)}>Log interaction</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleSnooze(7)}>Snooze</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleDismiss(30)}>Dismiss</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => {setEditing((value) => !value); setError("")}}>{editing ? "Cancel edit" : "Edit person"}</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm text-red-700 border-red-300" onClick = {handleDeletePerson}>Delete person</button>
                </div>
            </div>

            {person.notes && (
                <div className = "border rounded-xl p-4">
                    <div className = "font-semibold mb-1">Notes</div>
                    <div className = "text-sm whitespace-pre-wrap">{person.notes}</div>
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

                                    <button disabled = {busy} className = "text-xs px-2 py-1 rounded-xl border" onClick = {() => handleDeleteInteraction(it.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {logging && (
                <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick = {() => {setLogging(false); setError("")}}>
                    <form onSubmit = {handleAddInteraction} className = "bg-white w-full max-w-xl mx-auto rounded-xl p-6 space-y-4 shadow-xl" onClick = {(e) => e.stopPropagation()}>
                        <div className = "font-semibold">Log interaction</div>

                        {error && <div className = "text-red-600">{error}</div>}

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

                        <button className = "px-4 py-2 rounded-xl bg-black text-white disabled:opacity-70" disabled = {busy}>{saving ? "Saving..." : "Save interaction"}</button>
                    </form>
                </div>
            )}

            {editing && (
                <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick = {() => {setEditing(false); setError("")}}>
                    <form onSubmit = {handleSavePerson} className = "bg-white w-full max-w-xl mx-auto rounded-xl p-6 space-y-4 shadow-xl" onClick = {(e) => e.stopPropagation()}>
                        <div className = "font-semibold">Edit person</div>

                        {error && <div className = "text-red-600">{error}</div>}

                        <div className = "grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className = "block text-sm mb-1">Name</label>

                                <input 
                                    className = "w-full border rounded-xl px-3 py-2"
                                    value = {editName}
                                    onChange = {(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className = "block text-sm mb-1">Category</label>

                                <select
                                    className = "w-full border rounded-xl px-3 py-2"
                                    value = {editCategory}
                                    onChange = {(e) => setEditCategory(e.target.value)}
                                >
                                    <option value = "friend">Friend</option>
                                    <option value = "family">Family</option>
                                    <option value = "work">Work</option>
                                    <option value = "other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className = "block text-sm mb-1">Contact frequency (days)</label>

                                <input 
                                    className = "w-full border rounded-xl px-3 py-2"
                                    type = "number"
                                    min = {1}
                                    max = {3650}
                                    value = {editFrequency}
                                    onChange = {(e) => setEditFrequency(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className = "block text-sm mb-1">Priority</label>

                                <select
                                    className = "w-full border rounded-xl px-3 py-2"
                                    value = {editPriority}
                                    onChange = {(e) => setEditPriority(e.target.value)}
                                >
                                    <option value = {1}>High (1)</option>
                                    <option value = {2}>Normal (2)</option>
                                    <option value = {3}>Low (3)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className = "block text-sm mb-1">Notes</label>

                            <textarea 
                                className = "w-full border rounded-xl px-3 py-2"
                                rows = {3}
                                value = {editNotes}
                                onChange = {(e) => setEditNotes(e.target.value)}
                            />
                        </div>

                        <button disabled = {savingPerson} className = "px-4 py-2 rounded-xl bg-black text-white disabled:opacity-70">{savingPerson ? "Saving" : "Save changes"}</button>
                    </form>
                </div>
            )}
        </div>
     )
}