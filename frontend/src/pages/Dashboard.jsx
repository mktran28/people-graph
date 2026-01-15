import {useEffect, useState} from 'react';
import * as dailyApi from '../api/dailyReminders.api.js';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        try {
            setError("");
            setLoading(true);

            const data = await dailyApi.getToday();

            setItems(Array.isArray(data.people) ? data.people : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    },[]);

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div className = "text-red-600">{error}</div>
    }

    return (
        <div className = "space-y-4">
            <h1 className = "text-2xl font-bold">Today</h1>

            {items.length === 0 ? (
                <div className = "text-sm opacity-70">No one is overdue today.</div>
            ) : (
                <ul className = "space-y-3">
                    {items.map((p) => (
                        <li key = {p.id} className = "border rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <div className = " text-lg font-semibold">{p.name}</div>
                                <div className = "text-sm opacity-70">Priority {p.priority} every {p.contact_frequency_days} days</div>
                                <div>
                                    {p.last_interaction_at && (
                                        <div className = "text-xs opacity-70">Last contact: {" "}{new Date(p.last_interaction_at).toLocaleDateString()}</div>
                                    )}
                                </div>
                            </div>

                            <div className = "flex gap-2">
                                <button className = "px-2 py-1 text-sm rounded-xl border">Snooze</button>
                                <button className = "px-2 py-1 text-sm rounded-xl border">Dismiss</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}