import {useEffect, useState} from 'react';
import * as dailyApi from '../api/dailyReminders.api.js';
import * as remindersApi from '../api/reminders.api.js';
import {Link} from 'react-router-dom';
import {useToast} from '../context/ToastContext.jsx';
import {formatDateTime, daysBetween} from '../utils/date.js';
import {unwrapList, getErrorMessage} from '../utils/api.js';

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

    function countOverdueDays(person) {
        const frequency = Number(person.contact_frequency_days ?? 30);

        if (!person.last_interaction_at) {
            return frequency
        }

        const lastInteractionDate = new Date(person.last_interaction_at).getTime();

        if (Number.isNaN(lastInteractionDate)) {
            return null;
        }

        const daysSince = daysBetween(Date.now(), lastInteractionDate)
        return Math.max(0, daysSince - frequency);
    }

    const filtered = people
        .filter((p) => {
            const s = search.trim().toLowerCase();

            if (s && !String(p.name ?? "").toLowerCase().includes(s)) {
                return false;
            }

            if (priorityFilter !== "all" && String(p.priority) !== priorityFilter) {
                return false;
            }

            if (overdueOnly) {
                const overdue = countOverdueDays(p);

                if (overdue === null || overdue <= 0) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === "score") {
                return (b.relationship_score ?? 0) - (a.relationship_score ?? 0);
            }

            if (sortBy === "staleness") {
                return (countOverdueDays(b) ?? 0) - (countOverdueDays(a) ?? 0);
            }

            const pa = Number(a.priority ?? 99)
            const pb = Number(b.priority ?? 99);

            if (pa !== pb) {
                return pa - pb;
            }

            const oa = countOverdueDays(a) ?? 0;
            const ob = countOverdueDays(b) ?? 0;

            if (oa !== ob) {
                return ob - oa;
            }

            return (b.relationship_score ?? 0) - (a.relationship_score ?? 0);
        });

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

            {filtered.length === 0 ? (
                <div className = "text-sm opacity-70">No one is overdue today</div>
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
                                    <button className = "px-2 py-1 text-sm rounded-xl border" onClick = {() => handleSnooze(p.id, 7)}>Snooze</button>
                                    <button className = "px-2 py-1 text-sm rounded-xl border" onClick = {() => handleDismiss(p.id, 30)}>Dismiss</button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
}