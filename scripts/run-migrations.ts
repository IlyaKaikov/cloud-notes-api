import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const migrationsDir = path.join(process.cwd(), "migrations");

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        run_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const result = await client.query<{ name: string }>(
      `SELECT name FROM migrations`,
    );

    const appliedMigrations = new Set(result.rows.map((row) => row.name));

    for (const file of files) {
      if (appliedMigrations.has(file)) {
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, "utf8");

      console.log(`Running migration: ${file}`);
      await client.query(sql);
      await client.query(`INSERT INTO migrations (name) VALUES ($1)`, [file]);
    }

    await client.query("COMMIT");
    console.log("Migrations completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

void runMigrations();