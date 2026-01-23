import {apiFetch} from "./client";

export function snooze(person_id, days = 7) {
    return apiFetch(`/api/reminders/${person_id}/snooze`, {
        method: "POST",
        body: JSON.stringify({days})
    });
}

export function dismiss(person_id, days = 30) {
    return apiFetch(`/api/reminders/${person_id}/dismiss`, {
        method: "POST",
        body: JSON.stringify({days})
    });
}