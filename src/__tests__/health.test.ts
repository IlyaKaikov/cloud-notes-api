import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Health endpoints", () => {
  it("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Cloud Notes API is running",
    });
  });

  it("GET /api/v1/health should return healthy response", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "API is healthy",
    });
  });
});