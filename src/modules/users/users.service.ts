import { pool } from "../../config/db";
import { UpdateUserPayload } from "./users.types";

export async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id ASC"
  );
  return result.rows;
}

export async function getUserById(userId: any) {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [userId]
  );
  if (!result.rowCount) {
    return `There is no user for id ${userId}`;
  }
  return result.rows[0];
}

// UPDATE
export const updateUserByID = async (id: any, payload: UpdateUserPayload) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users
   SET
     name  = COALESCE($1, name),
     email = COALESCE($2, email),
     phone = COALESCE($3, phone),
     role  = COALESCE($4, role)
   WHERE id = $5
   RETURNING name, email, phone, role, created_at`,
    [name, email?.toLowerCase(), phone, role, id]
  );

  return result.rows[0];
};

//Delete
export const deleteUserByID = async (id: any) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};
