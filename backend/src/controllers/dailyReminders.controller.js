import {runDailyReminders, getDailyReminders} from '../models/dailyReminders.model.js';

export async function runDailyRemindersHandler(req, res) {
    try {
        const runDate = req.query.date ?? null;
        const result = await runDailyReminders(req.user.id, runDate);
        res.json({message: "Daily reminders computed", ...result});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to run daily reminders" });
    }
}

export async function getTodayRemindersHandler(req, res) {
    try {
        const runDate = req.query.date ?? null;
        const user_id = req.user.id;
        const result = await getDailyReminders(user_id, runDate);

        res.json({count: result.people.length, ...result});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch daily reminders"});
    }
}