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

export function updateInteraction(id, payload) {
    return apiFetch(`/api/interactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    })
}