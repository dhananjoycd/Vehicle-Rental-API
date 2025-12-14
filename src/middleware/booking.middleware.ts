import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";

export const checkActiveBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.params.userId);

  const result = await pool.query(
    `SELECT 1 FROM bookings
     WHERE id = $1 AND status = 'active'`,
    [userId]
  );

  if (result && typeof result.rowCount === "number" && result.rowCount > 0) {
    return res.status(400).json({
      message: "User has active bookings. Cannot delete.",
    });
  }

  next();
};
