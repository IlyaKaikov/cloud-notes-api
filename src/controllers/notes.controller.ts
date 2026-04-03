import { NextFunction, Request, Response } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  patchNote,
  updateNote,
} from "../services/notes.service";
import {
  isValidId,
  validateNoteInput,
  validatePartialNoteInput,
} from "../utils/noteValidation";
import { AppError } from "../utils/AppError";

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const sortBy =
      req.query.sortBy === "updated_at" ||
      req.query.sortBy === "title" ||
      req.query.sortBy === "created_at"
        ? req.query.sortBy
        : "created_at";

    const order =
      req.query.order === "asc" || req.query.order === "desc"
        ? req.query.order
        : "desc";

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("page must be a positive integer", 400);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new AppError("limit must be an integer between 1 and 100", 400);
    }

    const { notes, total } = await getAllNotes({
      page,
      limit,
      search,
      sortBy,
      order,
    });

    res.status(200).json({
      status: "ok",
      data: notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        search,
        sortBy,
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!isValidId(id)) {
      throw new AppError("Invalid note id", 400);
    }

    const note = await getNoteById(id);

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json({
      status: "ok",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const patchSingleNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, content } = req.body;

    if (!isValidId(id)) {
      throw new AppError("Invalid note id", 400);
    }

    const validation = validatePartialNoteInput(title, content);

    if (!validation.valid) {
      throw new AppError(validation.message || "Invalid input", 400);
    }

    const note = await patchNote(id, { title, content });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json({
      status: "ok",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const createSingleNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;

    const validation = validateNoteInput(title, content);

    if (!validation.valid) {
      throw new AppError(validation.message || "Invalid input", 400);
    }

    const note = await createNote(title, content);

    res.status(201).json({
      status: "ok",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSingleNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, content } = req.body;

    if (!isValidId(id)) {
      throw new AppError("Invalid note id", 400);
    }

    const validation = validateNoteInput(title, content);

    if (!validation.valid) {
      throw new AppError(validation.message || "Invalid input", 400);
    }

    const note = await updateNote(id, title, content);

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json({
      status: "ok",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSingleNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!isValidId(id)) {
      throw new AppError("Invalid note id", 400);
    }

    const deleted = await deleteNote(id);

    if (!deleted) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json({
      status: "ok",
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};