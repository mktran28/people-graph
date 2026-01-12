function weightForType(type) {
    const t = (type || "").toLowerCase();

    if (t === "meeting") {
        return 5;
    }

    if (t === "call") {
        return 3;
    }

    if (t === "message") {
        return 1;
    }

    return 1;
}

export function computeRelationshipScore(interactions, halfLifeDays = 30) {
    const now = Date.now();
    const halfLife = Number(halfLifeDays);

    let score = 0;

    for (const interaction of interactions) {
        const weight = weightForType(interaction.type);
        const occurredAt = new Date(interaction.occurred_at).getTime();

        if (Number.isNaN(occurredAt)) {
            continue;
        }

        const daysSince = (now - occurredAt) / (1000 * 60 * 60 * 24);
        const decay = Math.exp(-daysSince / halfLife);

        score += weight * decay;
    }

    return Math.round(score * 100) / 100;
}