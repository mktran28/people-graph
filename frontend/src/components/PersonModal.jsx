export default function PersonModal({
    onSubmit,
    error,
    name,
    setName,
    category,
    setCategory,
    contactFrequencyDays,
    setContactFrequencyDays,
    priority,
    setPriority,
    notes,
    setNotes,
    saving
}) {
    return (
        <form onSubmit = {onSubmit} className = "bg-white w-full max-w-xl mx-auto rounded-xl p-6 space-y-4">
            <div className = "text-lg font-semibold">Add person</div>

            {error && <div className = "text-red-600">{error}</div>}

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
                        <option value = "1">High (1)</option>
                        <option value = "2">Normal (2)</option>
                        <option value = "3">Low (3)</option>
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
    )
}