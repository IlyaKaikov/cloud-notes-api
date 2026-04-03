import { NextFunction, Request, Response } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../services/notes.service";
import { isValidId, validateNoteInput } from "../utils/noteValidation";
import { AppError } from "../utils/AppError";

export const getNotes = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notes = await getAllNotes();

    res.status(200).json({
      status: "ok",
      data: notes,
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