import express from "express";
import cors from "cors";
import { json } from "body-parser";
import authRouter from "./routes/auth";
import generationRouter from "./routes/generations";

const app = express();
app.use(cors());
app.use(json());

app.use("/auth", authRouter);
app.use("/generations", generationRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
