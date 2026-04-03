import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/test", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.status(200).json({
      status: "ok",
      message: "Database connection successful",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

export default router;