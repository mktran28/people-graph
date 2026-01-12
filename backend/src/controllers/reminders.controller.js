import {getDueReminders} from "../models/reminders.model.js";

export async function getDueRemindersHandler(req, res) {
    try {
        const people = await getDueReminders(req.user.id);
        res.json({count:people.length, people})
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch reminders"});
    }
}