import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gameData } from "./data/gameData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/game-content", (_req, res) => {
  res.json(gameData);
});

app.use(express.static(distDir));

app.get(/(.*)/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }

  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Mind Bloom server listening on http://localhost:${port}`);
});
