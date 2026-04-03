import pool from "../config/db";

type GetAllNotesOptions = {
  page: number;
  limit: number;
  search: string;
  sortBy: "created_at" | "updated_at" | "title";
  order: "asc" | "desc";
};

export const getAllNotes = async ({
  page,
  limit,
  search,
  sortBy,
  order,
}: GetAllNotesOptions) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  const dataQuery = pool.query(
    `
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE title ILIKE $1 OR content ILIKE $1
    ORDER BY ${sortBy} ${order}
    LIMIT $2 OFFSET $3
    `,
    [searchTerm, limit, offset],
  );

  const countQuery = pool.query(
    `
    SELECT COUNT(*)::int AS total
    FROM notes
    WHERE title ILIKE $1 OR content ILIKE $1
    `,
    [searchTerm],
  );

  const [dataResult, countResult] = await Promise.all([dataQuery, countQuery]);

  return {
    notes: dataResult.rows,
    total: countResult.rows[0].total,
  };
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

export const patchNote = async (
  id: string,
  updates: { title?: string; content?: string },
) => {
  const fields: string[] = [];
  const values: Array<string> = [];
  let index = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${index}`);
    values.push(updates.title.trim());
    index++;
  }

  if (updates.content !== undefined) {
    fields.push(`content = $${index}`);
    values.push(updates.content.trim());
    index++;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `
    UPDATE notes
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, title, content, created_at, updated_at
    `,
    values,
  );

  return result.rows[0] || null;
};