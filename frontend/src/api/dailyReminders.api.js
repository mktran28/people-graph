import {apiFetch} from './client';

export function runToday() {
    return apiFetch("/api/daily-reminders/run", {
        method: "POST",
    });
}

export function getToday() {
    return apiFetch("/api/daily-reminders/today");
}