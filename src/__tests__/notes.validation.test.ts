import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Notes API validation and error handling", () => {
  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Route /api/v1/does-not-exist not found",
    });
  });

  it("should return 400 for invalid note id on GET /notes/:id", async () => {
    const response = await request(app).get("/api/v1/notes/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "Invalid note id",
    });
  });

  it("should return 400 when creating a note with missing fields", async () => {
    const response = await request(app).post("/api/v1/notes").send({
      title: "Test title",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "title and content must be strings",
    });
  });

  it("should return 400 when creating a note with empty title", async () => {
    const response = await request(app).post("/api/v1/notes").send({
      title: "   ",
      content: "Some content",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "title and content cannot be empty",
    });
  });

  it("should return 400 when creating a note with title longer than 255 chars", async () => {
    const response = await request(app)
      .post("/api/v1/notes")
      .send({
        title: "a".repeat(256),
        content: "Some content",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "title must be at most 255 characters long",
    });
  });

  it("should return 400 for invalid note id on PATCH /notes/:id", async () => {
    const response = await request(app).patch("/api/v1/notes/not-a-number").send({
      title: "Updated",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "Invalid note id",
    });
  });

  it("should return 400 when PATCH body is empty", async () => {
    const response = await request(app).patch("/api/v1/notes/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "at least one of title or content must be provided",
    });
  });
});