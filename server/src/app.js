import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import recipesRouter from "./routes/recipes.js";
import foldersRouter from "./routes/folders.js";
import remindersRouter from "./routes/reminders.js";
import importRouter from "./routes/import.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_DIST_PATH = path.join(__dirname, "../../client/dist");

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/recipes", recipesRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/reminders", remindersRouter);
app.use("/api/import", importRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(CLIENT_DIST_PATH));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST_PATH, "index.html"));
  });
}

export default app;
