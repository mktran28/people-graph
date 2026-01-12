import {config} from '../config.js';

export function requireCronSecret(req, res, next) {
    const secret = req.headers["x-cron-secret"];
    
    if (!config.cronSecret || secret !== config.cronSecret) {
        return res.status(401).json({error: "Unauthorized"});
    }

    next();
}