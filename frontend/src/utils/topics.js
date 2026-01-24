export function parseTopics(input) {
    return String(input ?? "").split(",").map((t) => t.trim()).filter(Boolean);
}