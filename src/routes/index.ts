import { Router } from "express";
import healthRoutes from "./health.routes";
import dbRoutes from "./db.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/db", dbRoutes);

export default router;