import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorizeSelf, bookingAuthor } from "../../middleware/role.middleware";
import {
  createBooking,
  getAllBookings,
  updateBookings,
} from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, authorizeSelf, createBooking);
router.get("/", authMiddleware, getAllBookings);
router.put("/:bookingId", authMiddleware, bookingAuthor, updateBookings);

export default router;
