export default function InteractionModal({
    onAdd,
    error,
    type,
    setType,
    topics,
    setTopics,
    notes,
    setNotes,
    busy,
    saving
}) {
    return (
        <form onSubmit = {onAdd} className = "bg-white w-full max-w-xl mx-auto rounded-xl p-6 space-y-4 shadow-xl">
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
    )
}