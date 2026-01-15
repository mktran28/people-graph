import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import * as peopleApi from "../api/people.api.js"

function priorityLabel(p) {
    if (p === 1) {
        return "High";
    }

    if (p === 2) {
        return "Normal";
    }

    if (p === 3) {
        return "Low";
    }

    return String(p);
}

export default function People() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("friend");
    const [notes, setNotes] = useState("");
    const [contactFrequencyDays, setContactFrequencyDays] = useState(30);
    const [priority, setPriority] = useState(2);
    const [saving, setSaving] = useState(false);

    const sorted = useMemo(() => {
        return [...people];
    }, [people]);

    async function load() {
        try {
            setError("");
            setLoading(true);

            const data = await peopleApi.listPeople();

            setPeople(Array.isArray(data) ? data : (data.people ?? []));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [])

    async function handleCreate(e) {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            const payload = {
                name, 
                category,
                notes,
                contact_frequency_days: Number(contactFrequencyDays),
                priority: Number(priority)
            };

            await peopleApi.createPerson(payload);

            setName("");
            setCategory("friend");
            setNotes("");
            setContactFrequencyDays(30);
            setPriority(2);

            await load();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className = "space-y-6">
            <div className = "flex items-end justify-between">
                <h1 className = "text-2xl font-bold">People</h1>

                <button onClick = {load} className = "px-3 py-2 rounded-xl border text-sm">Refresh</button>
            </div>

            {error && <div className = "text-red-600">{error}</div>}

            {loading ? (
                <div>Loading people...</div>
            ) : sorted.length === 0 ? (
                <div className = "text-sm opacity-70">Add the first person.</div>
            ) : (
                <ul className = "space-y-3">
                    {sorted.map((p) => (
                        <li key = {p.id} className = "border rounded-lg p-4 bg-white shadow-sm">
                            <div className = "flex items-start justify-between gap-4">
                                <div className = "min-w-0">
                                    <div className = "flex items-center gap-2">
                                        <Link
                                            to = {`/people/${p.id}`}
                                            className = "text-lg font-semibold hover:underline"
                                        >
                                            {p.name}
                                        </Link>

                                        <span className = "text-xs px-2 py-1 rounded-xl border">
                                            {p.category || "uncategorized"}
                                        </span>

                                        <span className = "text-xs px-2 py-1 rounded-xl border">
                                            {priorityLabel(p.priority)}
                                        </span>
                                    </div>

                                    <div className = "mt-1 text-sm">
                                        Every <span className = "font-medium">{p.contact_frequency_days}</span> days
                                    </div>

                                    <div className = "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                        <div>
                                            <span>Score:</span>{" "}
                                            <span className = "font-medium">{(p.relationship_score ?? 0).toFixed?.(2) ?? (p.relationship_score ?? 0)}</span>
                                        </div>

                                        <div>
                                            <span>Last:</span>{" "}
                                            <span className = "font-medium">{p.last_interaction_at ? new Date(p.last_interaction_at).toLocaleDateString() : "Never"}</span>
                                        </div>
                                    </div>

                                    {p.notes && (
                                        <div className = "mt-3 text-xs">
                                            <span className = "font-medium">Notes:</span>{" "}
                                            {p.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit = {handleCreate} className = "border rounded-xl p-4 space-y-3">
                <div className = "text-lg font-semibold">Add person</div>

                <div className = "grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className = "block text-sm mb-1">Name</label>

                        <input 
                            className = "w-full border rounded-xl px-3 py-2"
                            value = {name}
                            onChange = {(e) => setName(e.target.value)}
                            placeholder = "Anne"
                            required
                        />
                    </div>

                    <div>
                        <label className = "block text-sm mb-1">Category</label>

                        <select 
                            className = "w-full border rounded-xl px-3 py-2"
                            value = {category}
                            onChange = {(e) => setCategory(e.target.value)}
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
                            value = {contactFrequencyDays}
                            onChange = {(e) => setContactFrequencyDays(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className = "block text-sm mb-1">Priority</label>

                        <select 
                            className = "w-full border rounded-xl px-3 py-2"
                            value = {priority}
                            onChange = {(e) => setPriority(e.target.value)}
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
                        value = {notes}
                        onChange = {(e) => setNotes(e.target.value)}
                        placeholder = "Context (e.g., how you met, what to remember)"
                    />
                </div>

                <button className = "px-4 py-2 rounded-xl bg-black text-white disabled:opacity-70" disabled={saving}>{saving ? "Saving..." : "Create"}</button>
            </form>
        </div>
    );
}