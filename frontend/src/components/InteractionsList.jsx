import {formatDateTime} from "../utils/date"

export default function InteractionsList({
    interactions, 
    editingInteractionId, 
    editInteractionType,
    setEditInteractionType,
    editInteractionTopics,
    setEditInteractionTopics,
    editInteractionNotes,
    setEditInteractionNotes,
    onStartEdit,
    onCancelEdit,
    onDelete,
    onSave,
    busy,
    savingInteraction
}) {
    return (
        <div className = "border rounded-xl p-4">
            <div className = "font-semibold mb-3">Recent interactions</div>

            {interactions.length === 0 ? (
                <div className = "text-sm opacity-70">No interactions yet.</div>
            ) : (
                <ul className = "space-y-3">
                    {interactions.map((it) => (
                        <li key = {it.id} className = "border rounded-xl p-3">
                            <div className = "flex items-start justify-between gap-3">
                                <div>
                                    <div className = "text-sm font-semibold"> {it.type}{" "}{formatDateTime(it.occurred_at)}</div>

                                    {it.notes && (<div className = "text-sm mt-1 whitespace-pre-wrap">{it.notes}</div>)}

                                    {Array.isArray(it.topics) && it.topics.length > 0 && (
                                        <div className = "mt-2 flex flex-wrap gap-2">
                                            {it.topics.map((t) => (
                                                <span key = {t} className = "text-xs px-2 py-1 rounded-xl border">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className = "flex gap-2">
                                    <button disabled = {busy} className = "text-xs px-2 py-1 rounded-xl border" onClick = {() => onStartEdit(it)}>Edit</button>
                                    <button disabled = {busy} className = "text-xs px-2 py-1 rounded-xl border" onClick = {() => onDelete(it.id)}>Delete</button>
                                </div>
                            </div>

                            {editingInteractionId === it.id ? (
                                <form onSubmit = {onSave} className = "mt-3 space-y-2">
                                    <div className = "grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <select 
                                            className = "w-full border rounded-xl px-3 py-2 text-sm"
                                            value = {editInteractionType}
                                            onChange = {(e) => setEditInteractionType(e.target.value)}
                                        >
                                            <option value = "message">Message</option>
                                            <option value = "call">Call</option>
                                            <option value = "meeting">Meeting</option>
                                            <option value = "other">Other</option>
                                        </select>

                                        <input 
                                            className = "w-full border rounded-xl px-3 py-2 text-sm"
                                            value = {editInteractionTopics}
                                            onChange = {(e) => setEditInteractionTopics(e.target.value)}
                                            placeholder = "Add topics..."
                                        />
                                    </div>

                                    <textarea 
                                        className = "w-full border rounded-xl px-3 py-2 text-sm"
                                        rows = {3}
                                        value = {editInteractionNotes}
                                        onChange={(e) => setEditInteractionNotes(e.target.value)}
                                    />

                                    <div className = "flex gap-2">
                                        <button disabled = {busy} className = "px-3 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-70">{savingInteraction ? "Saving..." : "Save"}</button>
                                        <button type = "button" className = "px-3 py-2 rounded-xl border text-sm" onClick = {() => onCancelEdit(null)}>Cancel</button>
                                    </div>
                                </form>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}