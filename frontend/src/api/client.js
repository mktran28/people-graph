const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiFetch(path, options = {}) {
    const result = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },

        credentials: "include",
    });

    const contentType = result.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await result.json() : await result.text();

    if (!result.ok) {
        const message = isJson && data?.error ? data.error : `Request failed (${result.status})`;
        const error = new Error(message);
        
        error.status = result.status;
        error.data = data;

        throw error;
    }

    return data;
}