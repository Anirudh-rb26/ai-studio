import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, password: hash },
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Invalid input or email exists" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch {
    res.status(400).json({ message: "Invalid input" });
  }
});

export default router;
