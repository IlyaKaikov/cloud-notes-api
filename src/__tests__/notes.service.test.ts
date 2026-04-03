import { beforeEach, describe, expect, it, vi } from "vitest";
import pool from "../config/db";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  patchNote,
  updateNote,
} from "../services/notes.service";

vi.mock("../config/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("notes.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllNotes should return notes and total count", async () => {
    vi.mocked(pool.query)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            title: "Note 1",
            content: "Content 1",
            created_at: "2026-04-03T10:00:00.000Z",
            updated_at: "2026-04-03T10:00:00.000Z",
          },
        ],
      } as never)
      .mockResolvedValueOnce({
        rows: [{ total: 1 }],
      } as never);

    const result = await getAllNotes({
      page: 1,
      limit: 10,
      search: "",
      sortBy: "created_at",
      order: "desc",
    });

    expect(result).toEqual({
      notes: [
        {
          id: 1,
          title: "Note 1",
          content: "Content 1",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T10:00:00.000Z",
        },
      ],
      total: 1,
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it("getNoteById should return a note when found", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          title: "Test note",
          content: "Test content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T10:00:00.000Z",
        },
      ],
    } as never);

    const result = await getNoteById("1");

    expect(result).toEqual({
      id: 1,
      title: "Test note",
      content: "Test content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T10:00:00.000Z",
    });

    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("getNoteById should return null when note does not exist", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
    } as never);

    const result = await getNoteById("999");

    expect(result).toBeNull();
  });

  it("createNote should return the created note", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          title: "New note",
          content: "New content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T10:00:00.000Z",
        },
      ],
    } as never);

    const result = await createNote("  New note  ", "  New content  ");

    expect(result).toEqual({
      id: 2,
      title: "New note",
      content: "New content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T10:00:00.000Z",
    });

    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("updateNote should return the updated note", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          title: "Updated title",
          content: "Updated content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T11:00:00.000Z",
        },
      ],
    } as never);

    const result = await updateNote("1", "  Updated title  ", "  Updated content  ");

    expect(result).toEqual({
      id: 1,
      title: "Updated title",
      content: "Updated content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T11:00:00.000Z",
    });
  });

  it("updateNote should return null when note does not exist", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
    } as never);

    const result = await updateNote("999", "Title", "Content");

    expect(result).toBeNull();
  });

  it("patchNote should return the patched note", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          title: "Patched title",
          content: "Existing content",
          created_at: "2026-04-03T10:00:00.000Z",
          updated_at: "2026-04-03T11:30:00.000Z",
        },
      ],
    } as never);

    const result = await patchNote("1", {
      title: "  Patched title  ",
    });

    expect(result).toEqual({
      id: 1,
      title: "Patched title",
      content: "Existing content",
      created_at: "2026-04-03T10:00:00.000Z",
      updated_at: "2026-04-03T11:30:00.000Z",
    });
  });

  it("deleteNote should return the deleted row when note exists", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ id: 1 }],
    } as never);

    const result = await deleteNote("1");

    expect(result).toEqual({ id: 1 });
  });

  it("deleteNote should return null when note does not exist", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
    } as never);

    const result = await deleteNote("999");

    expect(result).toBeNull();
  });
});