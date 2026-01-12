import bcrypt from 'bcrypt';
import {getUserByEmail, createUser, getUserById} from '../models/users.model.js';
import {signToken} from '../utils/jwt.js';
import {config} from '../config.js';

function cookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: config.cookieSecure,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

export async function registerHandler(req, res) {
    try {
        const email = String(req.body.email ?? "").trim().toLowerCase();
        const password = String(req.body.password ?? "");

        if (!email || !email.includes("@")) {
            return res.status(400).json({error: "Valid email required"});
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters"});
        }

        const exisiting = await getUserByEmail(email);

        if (exisiting) {
            return res.status(409).json({error: "Email already in use"});
        }

        const hash = await bcrypt.hash(password, 12);
        const user = await createUser(email, hash);
        const token = signToken({user_id: user.id, email: user.email});

        res.cookie("auth", token, cookieOptions());
        res.status(201).json({user});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to register"});
    }
}

export async function loginHandler(req, res) {
    try {
        const email = String(req.body.email ?? "").trim().toLowerCase();
        const password = String(req.body.password ?? "");
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const ok = await bcrypt.compare(password, user.password_hash);

        if (!ok) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = signToken({user_id: user.id, email: user.email});

        res.cookie("auth", token, cookieOptions());
        res.json({user: {id: user.id, email: user.email}})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to login" });
    }
}

export async function logoutHandler(req, res) {
    res.clearCookie("auth", {httpOnly: true, sameSite: "lax", secure: config.cookieSecure});
    res.json({message: "Logged out"});
}

export async function meHandler(req, res) {
    const user = await getUserById(req.user.id);
    res.json({user});
}