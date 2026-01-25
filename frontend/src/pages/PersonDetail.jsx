import {Link, useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import * as peopleApi from "../api/people.api.js";
import * as interactionsApi from "../api/interactions.api.js";
import * as remindersApi from "../api/reminders.api.js";
import {useToast} from "../context/ToastContext.jsx";
import {formatDateTime} from "../utils/date.js";
import {getErrorMessage} from "../utils/api.js";
import {parseTopics} from "../utils/topics.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Modal from "../components/Modal.jsx";
import InteractionsList from "../components/InteractionsList.jsx";
import InteractionModal from "../components/InteractionModal.jsx";
import PersonModal from "../components/PersonModal.jsx";

export default function PersonDetail() {
    const {id} = useParams();
    const person_id = Number(id);
    const {pushToast} = useToast();
    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [type, setType] = useState("message");
    const [notes, setNotes] = useState("");
    const [topics, setTopics] = useState("");
    const [saving, setSaving] = useState(false);
    const [logging, setLogging] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [editFrequency, setEditFrequency] = useState("30");
    const [editPriority, setEditPriority] = useState("2");
    const [savingPerson, setSavingPerson] = useState(false);
    const [editingInteractionId, setEditingInteractionId] = useState(null);
    const [editInteractionType, setEditInteractionType] = useState("message");
    const [editInteractionNotes, setEditInteractionNotes] = useState("");
    const [editInteractionTopics, setEditInteractionTopics] = useState("");
    const [savingInteraction, setSavingInteraction] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
            setError(getErrorMessage(error));
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
            const topicList = parseTopics(topics);

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
            setError(getErrorMessage(error));
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
            setError(getErrorMessage(error));
        }
     }

     async function handleSnooze(days) {
        setError("");

        try {
            await remindersApi.snooze(person_id, days);
            await load();
        } catch (error) {
            setError(getErrorMessage(error));
        }
     }

     async function handleDismiss(days) {
        setError("");

        try {
            await remindersApi.dismiss(person_id, days);
            await load();
        } catch (error) {
            setError(getErrorMessage(error));
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
            setError(getErrorMessage(error));
        } finally {
            setSavingPerson(false);
        }
     }
     
     async function handleDeletePerson() {
        setConfirmDeleteOpen(false);
        setError("");

        try {
            await peopleApi.deletePerson(person_id);
            pushToast({type: "info", message: "Person deleted."});
            
            navigate("/people", {replace: true});
        } catch (error) {
            const message = getErrorMessage(error);
            pushToast({type: "error", message: message});
            setError(message);
        }
     }

     function startEditInteraction(interaction) {
        setEditingInteractionId(interaction.id);
        setEditInteractionType(interaction.type || "message");
        setEditInteractionNotes(interaction.notes || "");
        setEditInteractionTopics(Array.isArray(interaction.topics) ? interaction.topics.join(", ") : "");
     }

     async function handleSaveInteraction(e) {
        e.preventDefault();
        setError("");
        setSavingInteraction(true);

        try {
            const topicList = parseTopics(editInteractionTopics);

            await interactionsApi.updateInteraction(editingInteractionId, {
                type: editInteractionType,
                notes: editInteractionNotes,
                topics: topicList
            });

            setEditingInteractionId(null);
            await load();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSavingInteraction(false);
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
    const busy = loading || saving || savingPerson || savingInteraction;

     return (
        <div className = "space-y-6">
            <div className = "text-sm opacity-70 flex items-center gap-2">
                <Link to = "/people" className = "hover:underline">← Back to people</Link>
            </div>

            <div className = "flex items-start justify-between gap-4">
                <div>

                    <h1 className = "text-2xl font-bold mt-1">{person.name}</h1>

                    <div className = "text-sm opacity-70">{person.category || "uncategorized"} | Priority {person.priority} | Every {" "}{person.contact_frequency_days} days</div>
                    <div className = "text-sm mt-2">Relationship score:{" "}{person.score_half_life_days ? `half-life ${person.score_half_life_days}d` : null}</div>
                    <div className = "text-sm">Last interaction:{" "}{person.last_interaction_at ? formatDateTime(person.last_interaction_at): "never"}</div>
                </div>

                <div className = "flex flex-row gap-2">
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => setLogging(true)}>Log interaction</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleSnooze(7)}>Snooze</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => handleDismiss(30)}>Dismiss</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => {setEditing((value) => !value); setError("")}}>{editing ? "Cancel edit" : "Edit person"}</button>
                    <button disabled = {busy} className = "px-3 py-2 rounded-xl border text-sm text-red-700 border-red-300" onClick = {() => setConfirmDeleteOpen(true)}>Delete person</button>
                </div>
            </div>

            {person.notes && (
                <div className = "border rounded-xl p-4">
                    <div className = "font-semibold mb-1">Notes</div>
                    <div className = "text-sm whitespace-pre-wrap">{person.notes}</div>
                </div>
            )}

            <InteractionsList 
                interactions = {recent_interactions}
                editingInteractionId = {editingInteractionId}
                editInteractionType = {editInteractionType}
                setEditInteractionType = {setEditInteractionType}
                editInteractionTopics = {editInteractionTopics}
                setEditInteractionTopics = {setEditInteractionTopics}
                editInteractionNotes = {editInteractionNotes}
                setEditInteractionNotes = {setEditInteractionNotes}
                onStartEdit = {startEditInteraction}
                onCancelEdit={() => setEditingInteractionId(null)}
                onDelete = {handleDeleteInteraction}
                onSave = {handleSaveInteraction}
                busy = {busy}
                savingInteraction = {savingInteraction}
            />

            <Modal open = {logging} onClose = {() => {setLogging(false); setError("")}}>
                <InteractionModal 
                    onAdd = {handleAddInteraction}
                    error = {error}
                    type = {type}
                    setType = {setType}
                    topics = {topics}
                    setTopics = {setTopics}
                    notes = {notes}
                    setNotes = {setNotes}
                    busy = {busy}
                    saving = {saving}
                />
            </Modal>

            <Modal open = {editing} onClose = {() => {setEditing(false); setError("")}}>
                <PersonModal 
                    onSubmit = {handleSavePerson}
                    error = {error}
                    name = {editName}
                    setName = {setEditName}
                    category = {editCategory}
                    setCategory = {setEditCategory}
                    contactFrequencyDays = {editFrequency}
                    setContactFrequencyDays = {setEditFrequency}
                    priority = {editPriority}
                    setPriority = {setEditPriority}
                    notes = {editNotes}
                    setNotes = {setEditNotes}
                    saving = {savingPerson}
                />
            </Modal>

            <ConfirmModal 
                open = {confirmDeleteOpen}
                title = "Delete person?"
                message = "This will delete the person and all their interactions"
                confirmText = "Delete"
                cancelText = "Cancel"
                danger
                onCancel= {() => setConfirmDeleteOpen(false)}
                onConfirm = {handleDeletePerson}
            />
        </div>
     )
}