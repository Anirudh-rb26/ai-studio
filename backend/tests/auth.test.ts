import request from "supertest";
import app from "../src/server";
import { describe, it, expect } from "@jest/globals";

describe("Auth API", () => {
  const signupEndpoint = "/auth/signup";
  const loginEndpoint = "/auth/login";
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = "testpass123";

  it("should signup a new user", async () => {
    const res = await request(app)
      .post(signupEndpoint)
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should fail to signup with invalid input", async () => {
    const res = await request(app).post(signupEndpoint).send({ email: "invalid", password: "123" }); // bad email, short pwd
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid input");
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to signup with duplicate email", async () => {
    // First, sign up with a new email
    await request(app).post(signupEndpoint).send({ email: testEmail, password: testPassword });

    // Try signing up again with the same email
    const res = await request(app)
      .post(signupEndpoint)
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Email already exists");
  });

  it("should login with correct credentials", async () => {
    // Ensure user exists
    await request(app).post(signupEndpoint).send({ email: testEmail, password: testPassword });

    const res = await request(app)
      .post(loginEndpoint)
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post(loginEndpoint)
      .send({ email: testEmail, password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should fail to login with invalid input", async () => {
    const res = await request(app).post(loginEndpoint).send({ email: "", password: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid input");
    expect(res.body).toHaveProperty("errors");
  });
});
