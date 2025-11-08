import "dotenv/config";

import cors from "cors";
import express from "express";
import { json } from "body-parser";
import authRouter from "./routes/auth";
import generationRouter from "./routes/generations";
import path from "node:path";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(json());

app.use("/auth", authRouter);
app.use("/generations", generationRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
