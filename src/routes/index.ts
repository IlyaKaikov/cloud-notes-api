import { Router } from "express";
import healthRoutes from "./health.routes";
import dbRoutes from "./db.routes";
import notesRoutes from "./notes.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/db", dbRoutes);
router.use("/notes", notesRoutes);

export default router;