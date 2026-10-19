
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-School-ID"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (_req, res) => {
  res.json({
    name: "ISS School Management",
    status: "running",
    version: "1.0.0",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ISS School Management API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled API error:", error.message);
    res.status(500).json({
      error: "An unexpected server error occurred.",
    });
  }
);

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`ISS API listening on port ${port}`);
});
