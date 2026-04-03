import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import * as notesService from "../services/notes.service";

vi.mock("../services/notes.service");

describe("Notes API success flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated notes on GET /api/v1/notes", async () => {
    vi.mocked(notesService.getAllNotes).mockResolvedValue({
      notes: [
        {
          id: 1,
          title: "First note",
          content: "First content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T10:00:00.000Z",
        },
      ],
      total: 1,
    });

    const response = await request(app).get("/api/v1/notes?page=1&limit=10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      data: [
        {
          id: 1,
          title: "First note",
          content: "First content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T10:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
      filters: {
        search: "",
        sortBy: "created_at",
        order: "desc",
      },
    });

    expect(notesService.getAllNotes).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: "",
      sortBy: "created_at",
      order: "desc",
    });
  });

  it("should return a single note on GET /api/v1/notes/:id", async () => {
    vi.mocked(notesService.getNoteById).mockResolvedValue({
      id: 1,
      title: "Test note",
      content: "Test content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T10:00:00.000Z",
    });

    const response = await request(app).get("/api/v1/notes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      data: {
        id: 1,
        title: "Test note",
        content: "Test content",
        created_at: "2026-04-03T10:00:00.000Z",
        updated_at: "2026-04-03T10:00:00.000Z",
      },
    });

    expect(notesService.getNoteById).toHaveBeenCalledWith("1");
  });

  it("should create a note on POST /api/v1/notes", async () => {
    vi.mocked(notesService.createNote).mockResolvedValue({
      id: 2,
      title: "New note",
      content: "New content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T10:00:00.000Z",
    });

    const response = await request(app).post("/api/v1/notes").send({
      title: "New note",
      content: "New content",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: "ok",
      data: {
        id: 2,
        title: "New note",
        content: "New content",
        created_at: "2026-04-03T10:00:00.000Z",
        updated_at: "2026-04-03T10:00:00.000Z",
      },
    });

    expect(notesService.createNote).toHaveBeenCalledWith("New note", "New content");
  });

  it("should fully update a note on PUT /api/v1/notes/:id", async () => {
    vi.mocked(notesService.updateNote).mockResolvedValue({
      id: 1,
      title: "Updated title",
      content: "Updated content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T11:00:00.000Z",
    });

    const response = await request(app).put("/api/v1/notes/1").send({
      title: "Updated title",
      content: "Updated content",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      data: {
        id: 1,
        title: "Updated title",
        content: "Updated content",
        created_at: "2026-04-03T10:00:00.000Z",
        updated_at: "2026-04-03T11:00:00.000Z",
      },
    });

    expect(notesService.updateNote).toHaveBeenCalledWith(
      "1",
      "Updated title",
      "Updated content",
    );
  });

  it("should partially update a note on PATCH /api/v1/notes/:id", async () => {
    vi.mocked(notesService.patchNote).mockResolvedValue({
      id: 1,
      title: "Patched title",
      content: "Existing content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T11:30:00.000Z",
    });

    const response = await request(app).patch("/api/v1/notes/1").send({
      title: "Patched title",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      data: {
        id: 1,
        title: "Patched title",
        content: "Existing content",
        created_at: "2026-04-03T10:00:00.000Z",
        updated_at: "2026-04-03T11:30:00.000Z",
      },
    });

    expect(notesService.patchNote).toHaveBeenCalledWith("1", {
      title: "Patched title",
      content: undefined,
    });
  });

  it("should delete a note on DELETE /api/v1/notes/:id", async () => {
    vi.mocked(notesService.deleteNote).mockResolvedValue({ id: 1 });

    const response = await request(app).delete("/api/v1/notes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "Note deleted successfully",
    });

    expect(notesService.deleteNote).toHaveBeenCalledWith("1");
  });
});