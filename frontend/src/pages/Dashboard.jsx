import {useEffect, useMemo, useState} from 'react';
import * as dailyApi from '../api/dailyReminders.api.js';
import * as remindersApi from '../api/reminders.api.js';
import {Link} from 'react-router-dom';
import {useToast} from '../context/ToastContext.jsx';
import {formatDateTime} from '../utils/date.js';
import {unwrapList, getErrorMessage} from '../utils/api.js';
import {countOverdueDays, filterAndSortPeople} from '../utils/filter.js';
import PeopleFilter from "../components/PeopleFilter.jsx";

export default function Dashboard() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [overdueOnly, setOverdueOnly] = useState(false);
    const [sortBy, setSortBy] = useState("priority");
    const {pushToast} = useToast();
    const filtered = useMemo(
        () => filterAndSortPeople(people, {search, priorityFilter, sortBy, overdueOnly}),
        [people, search, priorityFilter, sortBy, overdueOnly]
    );

    async function loadToday() {
        const data = await dailyApi.getToday();
        const arr = unwrapList(data, ["people", "items"]);
        setPeople(arr);
    }

    async function runAndLoad() {
        setError("");
        setRunning(true);

        try {
            await dailyApi.runToday();
            await loadToday();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setRunning(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        runAndLoad().finally(() => setLoading(false));
    }, []);

    async function handleSnooze(person_id, days) {
        try {
            await remindersApi.snooze(person_id, days);
            await runAndLoad();
            pushToast({type: "info", message: `Snoozed for ${days} days`})
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            pushToast({type: "error", message: message})
        }
    }

    async function handleDismiss(person_id, days) {
        try {
            await remindersApi.dismiss(person_id, days);
            await runAndLoad()
            pushToast({type: "info", message: `Dismissed for ${days} days`})
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            pushToast({type: "error", message: message})
        }
    }
    
    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div className = "text-red-600">{error}</div>
    }

    return (
        <div className = "space-y-4">
            <div className = "flex items-start justify-between gap-4">
                <div>
                    <h1 className = "text-2xl font-bold">Dashboard</h1>
                    <div className = "text-xl opacity-70">Today's due reminders</div>
                </div>

                <button onClick = {runAndLoad} disabled = {running} className = "px-3 py-2 rounded-xl border text-sm disabled:opacity-70">{running ? "Refreshing...": "Refresh"}</button>
            </div>

            <PeopleFilter 
                search = {search}
                setSearch = {setSearch}
                priorityFilter = {priorityFilter}
                setPriorityFilter = {setPriorityFilter}
                sortBy = {sortBy}
                setSortBy = {setSortBy}
                overdueOnly = {overdueOnly}
                setOverdueOnly = {setOverdueOnly}
            />

            {filtered.length === 0 ? (
                <div className = "text-sm opacity-70">No matches</div>
            ) : (
                <ul className = "space-y-3">
                    {filtered.map((p) => {
                        const overdue = countOverdueDays(p);

                        return (
                            <li key = {p.id} className = "border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <Link to = {`/people/${p.id}`} className = "font-semibold hover:underline">{p.name}</Link>
                                    <div className = "text-sm opacity-70"> Priority {p.priority} every {p.contact_frequency_days} days</div>
                                    <div className = "text-sm opacity-70"> Score:{" "}{p.relationship_score ?? 0} | Last:{" "}{p.last_interaction_at ? formatDateTime(p.last_interaction_at) : "never"}</div>
                                    <div className = "text-sm opacity-70">
                                        {p.last_interaction_at ? (
                                            overdue > 0 ? (
                                                <>Overdue by {overdue} days</>
                                            ) : (
                                                <>Due today</>
                                            )
                                        ) : (
                                            <>No interactions yet</>
                                        )}
                                    </div>
                                </div>

                                <div className = "flex gap-2">
                                    <button disabled = {running} className = "px-2 py-1 text-sm rounded-xl border" onClick = {() => handleSnooze(p.id, 7)}>Snooze</button>
                                    <button disabled = {running} className = "px-2 py-1 text-sm rounded-xl border" onClick = {() => handleDismiss(p.id, 30)}>Dismiss</button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
}