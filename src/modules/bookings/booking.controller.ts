import { Request, Response } from "express";
import { VehiclePayLoad } from "../vehicles/vehicle.type";
import { createBookingDB } from "./booking.service";
import { CreateBooking } from "./booking.types";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const payload: CreateBooking = {
      ...req.body,
    };

    const booking = await createBookingDB(payload);

    res.status(201).json({
      success: true,
      message: "Bookings created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Bookings ",
      error,
    });
  }
};
/* 
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

    console.log("Controller", result);

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
 */
