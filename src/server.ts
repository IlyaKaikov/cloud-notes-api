import dotenv from "dotenv";
import app from "./app";
import pool from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

void startServer();