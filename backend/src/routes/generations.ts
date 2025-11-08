import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client";
import { authMiddleware } from "./auth";
import { upload } from "./upload";
import multer from "multer";

const router = Router();

// Request validation schemas
const createGenerationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500, "Prompt too long"),
  style: z.enum(["realistic", "artistic", "minimalist"]).describe("The visual style of the image"),
});

const getGenerationsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(5),
});

// Helper function to get full image URL
const getFullImageUrl = (relativePath: string): string => {
  const baseUrl = process.env.API_URL || "http://localhost:3001";
  return `${baseUrl}${relativePath}`;
};

// POST /generations - Create new generation
router.post("/", authMiddleware, upload.single("image"), async (req: Request, res: Response) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Image upload is required",
      });
    }

    // Validate request body
    const validation = createGenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.issues,
      });
    }

    const { prompt, style } = validation.data;

    // Simulate processing delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simulate 20% "Model overloaded" error
    if (Math.random() < 0.2) {
      return res.status(503).json({
        error: "MODEL_OVERLOADED",
        message: "Model overloaded. Please try again.",
        retryable: true,
      });
    }

    // Store relative path in database
    const relativePath = `/uploads/${req.file.filename}`;

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        prompt,
        style,
        imageUrl: relativePath,
        status: "completed",
        userId: req.user!.id,
      },
    });

    // Return full URL in response
    res.status(201).json({
      id: generation.id,
      imageUrl: getFullImageUrl(generation.imageUrl),
      prompt: generation.prompt,
      style: generation.style,
      status: generation.status,
      createdAt: generation.createdAt,
    });
  } catch (error) {
    console.error("Generation creation error:", error);

    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "FILE_TOO_LARGE",
          message: "File size exceeds 10MB limit",
        });
      }
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to create generation",
    });
  }
});

// GET /generations - Get user's recent generations
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = getGenerationsSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid query parameters",
        details: validation.error.issues,
      });
    }

    const { limit } = validation.data;

    const generations = await prisma.generation.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        style: true,
        status: true,
        createdAt: true,
      },
    });

    // Convert relative paths to full URLs
    const generationsWithFullUrls = generations.map((gen) => ({
      ...gen,
      imageUrl: getFullImageUrl(gen.imageUrl),
    }));

    res.json({ generations: generationsWithFullUrls, total: generationsWithFullUrls.length });
  } catch (error) {
    console.error("Fetch generations error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch generations",
    });
  }
});

export default router;
