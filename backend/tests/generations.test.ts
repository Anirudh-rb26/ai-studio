import path from "path";
import app from "../src/server";
import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";

describe("Generations API", () => {
  let token = "";
  const signupEndpoint = "/auth/signup";
  const testEmail = `gen${Date.now()}@example.com`;
  const testPassword = "generate1";
  const createEndpoint = "/generations";
  const getEndpoint = "/generations";

  beforeAll(async () => {
    // Signup and store token for auth
    const res = await request(app)
      .post(signupEndpoint)
      .send({ email: testEmail, password: testPassword });
    token = res.body.token;
  });

  it("should require auth for generations POST", async () => {
    const res = await request(app).post(createEndpoint);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should reject POST with missing image", async () => {
    const res = await request(app)
      .post(createEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "A red dress")
      .field("style", "realistic");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "VALIDATIONERROR");
    expect(res.body).toHaveProperty("message", "Image upload is required");
  });

  it("should reject POST with missing prompt or style", async () => {
    const res = await request(app)
      .post(createEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", path.resolve(__dirname, "../uploads/test.jpg"));
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "VALIDATIONERROR");
    expect(res.body).toHaveProperty("message");
  });

  it("should succeed POST and return generation", async () => {
    const res = await request(app)
      .post(createEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "A blue shirt")
      .field("style", "realistic")
      .attach("image", path.resolve(__dirname, "../uploads/test.png")); // Include a test image file
    expect([201, 503]).toContain(res.status); // 201 for success, 503 if overload
    if (res.status === 201) {
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("imageUrl");
      expect(res.body).toHaveProperty("prompt", "A blue shirt");
      expect(res.body).toHaveProperty("style", "realistic");
      expect(res.body).toHaveProperty("status", "completed");
      expect(res.body).toHaveProperty("createdAt");
    }
    if (res.status === 503) {
      expect(res.body).toHaveProperty("error", "MODELOVERLOADED");
      expect(res.body).toHaveProperty("retryable", true);
    }
  });

  it("should GET last 5 generations for user", async () => {
    const res = await request(app)
      .get(getEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 5 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.generations)).toBe(true);
    expect(res.body).toHaveProperty("total");
  });

  it("should require auth for generations GET", async () => {
    const res = await request(app).get(getEndpoint).query({ limit: 5 });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "No token provided");
  });
});
