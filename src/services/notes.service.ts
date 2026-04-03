import pool from "../config/db";

export const getAllNotes = async () => {
  const result = await pool.query(
    `
    SELECT id, title, content, created_at, updated_at
    FROM notes
    ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

export const getNoteById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const createNote = async (title: string, content: string) => {
  const result = await pool.query(
    `
    INSERT INTO notes (title, content)
    VALUES ($1, $2)
    RETURNING id, title, content, created_at, updated_at
    `,
    [title.trim(), content.trim()],
  );

  return result.rows[0];
};

export const updateNote = async (
  id: string,
  title: string,
  content: string,
) => {
  const result = await pool.query(
    `
    UPDATE notes
    SET title = $1,
        content = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING id, title, content, created_at, updated_at
    `,
    [title.trim(), content.trim(), id],
  );

  return result.rows[0] || null;
};

export const deleteNote = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM notes
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return result.rows[0] || null;
};