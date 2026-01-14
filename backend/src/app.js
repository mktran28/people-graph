import express from 'express';
import peopleRoutes from "./routes/people.routes.js";
import interactionsRoutes from  "./routes/interactions.routes.js";
import remindersRoutes from "./routes/reminders.routes.js";
import reminderStatesRoutes from "./routes/reminderStates.routes.js";
import dailyRemindersRoutes from "./routes/dailyReminders.routes.js";
import relationshipScoreRoutes from "./routes/relationshipScore.routes.js";
import authRoutes from "./routes/auth.routes.js";
import topicsRoutes from "./routes/topics.routes.js";
import {notFound, errorHandler} from "./middlewares/error.middleware.js";
import cors from 'cors';
import {config} from './config.js';
import cookieParser from 'cookie-parser';
import {requireAuth} from './middlewares/auth.middleware.js';

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ok: true});
});

app.use("/api/auth", authRoutes);
app.use("/api/people", requireAuth, peopleRoutes);
app.use("/api/interactions", requireAuth, interactionsRoutes);
app.use("/api/reminders", requireAuth, remindersRoutes);
app.use("/api/reminders", requireAuth, reminderStatesRoutes);
app.use("/api/daily-reminders", dailyRemindersRoutes);
app.use("/api", relationshipScoreRoutes);
app.use("/api/topics", requireAuth, topicsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;