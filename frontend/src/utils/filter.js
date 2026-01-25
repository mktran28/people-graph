import {daysBetween} from "./date.js";

export function countOverdueDays(person) {
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

export function filterAndSortPeople(people, {search = "", priorityFilter = "all", overdueOnly = false, sortBy = "priority"} = {}) {
    const s = String(search).trim().toLowerCase();
    
    return people
        .filter((p) => {
            if (s && !String(p.name ?? "").toLowerCase().includes(s)) {
                return false;
            }

            if (priorityFilter !== "all" && String(p.priority) !== String(priorityFilter)) {
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

            const pa = Number(a.priority ?? 99);
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
}