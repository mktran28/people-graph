import {apiFetch} from "./client";

export function createInteraction(payload) {
    return apiFetch("/api/interactions", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function deleteInteraction(id) {
    return apiFetch(`/api/interactions/${id}`, {
        method: "DELETE"
    })
}