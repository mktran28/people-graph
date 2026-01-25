import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as peopleApi from "../api/people.api.js"
import {getErrorMessage, unwrapList} from "../utils/api.js";
import {formatDateOnly} from "../utils/date.js";
import Modal from "../components/Modal.jsx";
import PersonModal from "../components/PersonModal.jsx";

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
    const [contactFrequencyDays, setContactFrequencyDays] = useState("30");
    const [priority, setPriority] = useState("2");
    const [saving, setSaving] = useState(false);
    const [addingPerson, setAddingPerson] = useState(false);

    async function load() {
        try {
            setError("");
            setLoading(true);

            const data = await peopleApi.listPeople();

            setPeople(unwrapList(data, ["people"]));
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [])

    useEffect(() => {
        const openModal = addingPerson;
        document.body.style.overflow = openModal ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        }
    }, [addingPerson])

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
            setContactFrequencyDays("30");
            setPriority("2");
            setAddingPerson(false);

            await load();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className = "space-y-6">
            <div className = "flex items-end justify-between">
                <h1 className = "text-2xl font-bold">People</h1>

                <div className = "flex gap-2">
                    <button onClick = {() => setAddingPerson(true)} className = "px-3 py-2 rounded-xl border text-sm">Add person</button>
                    <button onClick = {load} className = "px-3 py-2 rounded-xl border text-sm">Refresh</button>
                </div>
            </div>

            {error && <div className = "text-red-600">{error}</div>}

            {loading ? (
                <div>Loading people...</div>
            ) : people.length === 0 ? (
                <div className = "text-sm opacity-70">Add the first person.</div>
            ) : (
                <ul className = "space-y-3">
                    {people.map((p) => (
                        <li key = {p.id} className = "border rounded-lg p-4 bg-white shadow-sm">
                            <div className = "flex items-start justify-between gap-4">
                                <div className = "min-w-0">
                                    <div className = "flex items-center gap-2">
                                        <Link to = {`/people/${p.id}`} className = "text-lg font-semibold hover:underline">{p.name}</Link>

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
                                            <span className = "font-medium">{p.last_interaction_at ? formatDateOnly(p.last_interaction_at) : "Never"}</span>
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

            <Modal open = {addingPerson} onClose = {() => setAddingPerson(false)}>
                <PersonModal 
                    onSubmit = {handleCreate}
                    error = {error}
                    name = {name}
                    setName = {setName}
                    category = {category}
                    setCategory = {setCategory}
                    contactFrequencyDays = {contactFrequencyDays}
                    setContactFrequencyDays = {setContactFrequencyDays}
                    priority = {priority}
                    setPriority = {setPriority}
                    notes = {notes}
                    setNotes = {setNotes}
                    saving = {saving}
                />
            </Modal>
        </div>
    );
}