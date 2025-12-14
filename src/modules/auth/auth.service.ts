import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, SigninPayload, SignupPayload } from "./auth.types";
import { pool } from "../../config/db";
import { env } from "../../config/env";

const SALT_ROUNDS = 10;

export async function signupUser(payload: SignupPayload) {
  const { name, email, password, phone } = payload;

  // check existing user
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  if (existing.rowCount) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, 'customer')
     RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone]
  );
  return result.rows[0];
}

export async function signinUser(payload: SigninPayload) {
  const { email, password } = payload;

  const result = await pool.query(
    `SELECT id, name, email, phone, password, role
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (!result.rowCount) {
    throw new Error("Invalid email or password");
  }
  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const tokenPayload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  //Ignore Password

  const { password: _, ...safeUser } = user;

  const token = jwt.sign(tokenPayload, env.JWT_SECRET as string, {
    expiresIn: "7d", //best practice , by using env
  });
  return { token, user: safeUser };
}
