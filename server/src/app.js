import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import recipesRouter from "./routes/recipes.js";
import foldersRouter from "./routes/folders.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

export default app;
