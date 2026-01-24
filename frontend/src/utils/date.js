export function formatDateTime(value) {
    try {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    } catch {
        return String(value);
    }
}

export function formatDateOnly(value) {
    try {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString();
    } catch {
        return String(value);
    }
}

export function daysBetween(a, b) {
    const ms = 1000 * 60 * 60 * 24;
    return Math.floor((a - b) / ms);
}