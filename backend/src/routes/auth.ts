import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { z, ZodError } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log("Signup request received:", req.body);

    const data = schema.parse(req.body);
    console.log("Validation passed:", data);

    const hash = await bcrypt.hash(data.password, 10);
    console.log("Password hashed");

    const user = await prisma.user.create({
      data: { email: data.email, password: hash },
    });
    console.log("User created:", user.id);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error("Signup error:", err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: err.issues, // Use 'issues' instead of 'errors'
      });
    }

    // Handle Prisma unique constraint violation (duplicate email)
    if (err && typeof err === "object" && "code" in err) {
      if (err.code === "P2002") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    // Generic error
    res.status(500).json({
      message: "An error occurred during signup",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const data = schema.parse(req.body);
    console.log("Validation passed");

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    console.log("User found:", !!user);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: err.issues,
      });
    }

    res.status(500).json({
      message: "An error occurred during login",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default router;
