export default function PeopleFilter({
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    overdueOnly,
    setOverdueOnly
}) {
    return (
        <div className = "grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
                className = "border rounded-xl px-3 py-2 text-sm"
                placeholder = "Filter people..."
                value = {search}
                onChange = {(e) => setSearch(e.target.value)}
            />

            <select
                className = "border rounded-xl px-3 py-2 text-sm"
                value = {priorityFilter}
                onChange = {(e) => setPriorityFilter(e.target.value)}
            >
                <option value = "all">All priorities</option>
                <option value = "1">High (1)</option>
                <option value = "2">Medium (2)</option>
                <option value = "3">Low (3)</option>
            </select>

            <select
                className = "border rounded-xl px-3 py-2 text-sm"
                value = {sortBy}
                onChange = {(e) => setSortBy(e.target.value)}
            >
                <option value = "priority">Sort: Priority</option>
                <option value = "staleness">Sort: Most overdue</option>
                <option value = "score">Sort: Highest score</option>
            </select>

            <label className = "flex items-center gap-2 text-sm">
                <input 
                    type = "checkbox"
                    checked = {overdueOnly}
                    onChange = {(e) => setOverdueOnly(e.target.checked)}
                />
                Overdue only
            </label>
        </div>
    )
}