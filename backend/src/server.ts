
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/", (_req, res) => {
  res.json({
    name: "ISS School Management",
    status: "running",
    version: "1.0.0"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ISS School Management API"
  });
});

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found"
  });
});

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`ISS API listening on ${port}`);
});
