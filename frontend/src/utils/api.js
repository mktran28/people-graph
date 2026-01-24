export function unwrapList(data, keys = []) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === "object") {
        for (const key of keys) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }
    }

    return [];
}

export function getErrorMessage(error) {
    if (!error) {
        return "Unknown error";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (typeof error.message === "string") {
        return error.message;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown error";
    }
}