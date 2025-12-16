import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  authorizeAdmin,
  authorizeSelf,
} from "../../middleware/role.middleware";
import { createBooking } from "./booking.controller";

const router = Router();

/**
 * User routes
 */
router.post("/", authMiddleware, authorizeSelf, createBooking);
/* router.get("/", authMiddleware, authorizeSelf, getAllBookings);
router.put("/:bookingId", authMiddleware, authorizeSelf, deleteBooking); */

export default router;
