import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../config/db";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: Token missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token format",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token as any, env.JWT_SECRET) as JwtPayload;

    const user = await pool.query(
      `  
        SELECT * FROM users WHERE id=$1
      `,
      [decoded.userId]
    );

    if (!user.rows[0]) {
      return res.status(401).json({ message: "User Not Found" });
    }

    (req as any).user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
