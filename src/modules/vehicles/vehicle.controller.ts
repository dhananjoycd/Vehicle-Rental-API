import { Request, Response } from "express";
import {
  createVehicleDB,
  deleteVehicleDB,
  getAllVehiclesDB,
  getVehicleByIdDB,
  updateVehicleDB,
} from "./vehicle.service";
import { VehiclePayLoad } from "./vehicle.type";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const payload: VehiclePayLoad = {
      ...req.body,
      daily_rent_price: Number(req.body.daily_rent_price),
    };

    const vehicle = await createVehicleDB(payload);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error,
    });
  }
};

export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesDB();

    res.status(200).json({
      success: true,
      message: vehicles.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles",
      error,
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await getVehicleByIdDB(Number(req.params.vehicleId));

    res.status(200).json({
      success: true,
      message: vehicle.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: vehicle[0] || { ...vehicle },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicle",
      error,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const payload: VehiclePayLoad = {
      ...req.body,
      daily_rent_price: Number(req.body.daily_rent_price),
    };

    const result = await updateVehicleDB(Number(req.params.vehicleId), payload);

    res.status(200).json({
      success: true,
      message: result.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: result[0] || result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error,
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await deleteVehicleDB(Number(req.params.vehicleId));

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error,
    });
  }
};
