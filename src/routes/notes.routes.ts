import { Router } from "express";
import {
  createSingleNote,
  getNotes,
  getSingleNote,
  removeSingleNote,
  updateSingleNote,
} from "../controllers/notes.controller";

const router = Router();

router.get("/", getNotes);
router.get("/:id", getSingleNote);
router.post("/", createSingleNote);
router.put("/:id", updateSingleNote);
router.delete("/:id", removeSingleNote);

export default router;