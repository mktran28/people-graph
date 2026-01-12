import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 8000,
    databaseURL: process.env.DATABASE_URL,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    cronSecret: process.env.CRON_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    cookieSecure: process.env.COOKIE_SECURE === "true",
};