import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const jwtPayloadSchema = z.object({
  id: z.number(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = jwtPayloadSchema.safeParse(decoded);

    if (!result.success) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = result.data;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const schema = z.object({
    prompt: z.string(),
    style: z.string(),
    imageUrl: z.string(),
  });

  try {
    const { prompt, style, imageUrl } = schema.parse(req.body);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

    if (Math.random() < 0.2) {
      return res.status(503).json({ message: "Model overloaded" });
    }

    const generation = await prisma.generation.create({
      data: {
        prompt,
        style,
        imageUrl,
        userId: req.user!.id,
      },
    });
    res.json(generation);
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const gens = await prisma.generation.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  res.json(gens);
});

export default router;
