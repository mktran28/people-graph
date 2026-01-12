import {verifyToken} from "../utils/jwt.js";

export function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.auth;

        if (!token) {
            return res.status(401).json({error: "Not authenticated"});
        }

        const payload = verifyToken(token);

        req.user = {id: payload.user_id, email: payload.email};
        next();
    } catch {
        return res.status(401).json({error: "Not authenticated"});
    }
}