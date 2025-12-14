import { Router } from "express";
import {
  getUsers,
  getUserByID,
  updateUserById,
  deleteUserById,
} from "./users.controller";
import {
  authorizeAdmin,
  authorizeSelf,
} from "../../middleware/role.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { checkActiveBookings } from "../../middleware/booking.middleware";

const router = Router();

router.get("/", authMiddleware, authorizeAdmin, getUsers);
router.get("/:userId", authMiddleware, authorizeSelf, getUserByID);
router.put("/:userId", authMiddleware, authorizeSelf, updateUserById);
router.delete(
  "/:userId",
  authMiddleware,
  authorizeAdmin,
  checkActiveBookings,
  deleteUserById
);

export default router;
