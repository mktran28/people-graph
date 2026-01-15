import {apiFetch} from "./client";

export function listPeople() {
    return apiFetch("/api/people?halfLifeDays=30");
}

export function createPerson(payload) {
    return apiFetch("/api/people", {
        method: "POST",
        body: JSON.stringify(payload)
    })
}

export function updatePerson(id, payload) {
    return apiFetch(`/api/people/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    })
}

export function deletePerson(id) {
    return apiFetch(`/api/people/${id}`, {
        method: "DELETE"
    })
}