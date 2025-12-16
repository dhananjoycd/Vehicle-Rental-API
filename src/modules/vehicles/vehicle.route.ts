import { Router } from "express";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
} from "./vehicle.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorizeAdmin } from "../../middleware/role.middleware";

const router = Router();

//Public
router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);

//Admin
router.post("/", authMiddleware, authorizeAdmin, createVehicle);
router.put("/:vehicleId", authMiddleware, authorizeAdmin, updateVehicle);
router.delete("/:vehicleId", authMiddleware, authorizeAdmin, deleteVehicle);

export default router;
