import "dotenv/config";
import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import { pool, migrate } from "./config/db";
import { api } from "./routes/api";
import { HttpError } from "./domain";
const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(",") || true }));
app.use(express.json({ limit: "100kb" }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "postgresql" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});
app.use("/api/v1", api);
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof ZodError) {
      res
        .status(400)
        .json({
          error: err.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        });
      return;
    }
    if (err.code === "23505") {
      res
        .status(409)
        .json({ error: "This phone, email, or record already exists." });
      return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "Photo must be smaller than 6 MB." });
      return;
    }
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    if (err.type === "entity.parse.failed") {
      res.status(400).json({ error: "Invalid JSON request." });
      return;
    }
    console.error("Request failed:", err.message);
    res
      .status(500)
      .json({ error: "The request could not be saved. Please try again." });
  },
);
const port = Number(process.env.PORT || 4000);
migrate()
  .then(() => {
    const server = app.listen(port, "0.0.0.0", () =>
      console.log(`EcoCollect API ready on http://localhost:${port}`),
    );
    process.on("SIGTERM", () =>
      server.close(() => {
        void pool.end();
      }),
    );
  })
  .catch((e) => {
    console.error("Database startup failed:", e.message);
    process.exit(1);
  });
