import { Request, Response } from "express";
import {
  createBookingDB,
  getAllBookingsDB,
  updateBookingDB,
} from "./booking.service";
import { CreateBooking } from "./booking.types";
import { getVehicleByIdDB } from "../vehicles/vehicle.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const payload: CreateBooking = {
      ...req.body,
    };

    const booking = await createBookingDB(payload);
    const carData = await getVehicleByIdDB(payload.vehicle_id);

    res.status(201).json({
      success: true,
      message: "Bookings created successfully",
      data: {
        ...booking,
        vehicle: {
          vehicle_name: carData[0].vehicle_name,
          daily_rent_price: Number(carData[0].daily_rent_price),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Bookings ",
      error,
    });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  const { id, role } = (req as any).user;
  try {
    const booking = await getAllBookingsDB(id, role);
    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateBookings = async (req: Request, res: Response) => {
  try {
    const { id, role } = (req as any).user;
    const { status } = req.body;
    const { bookingId } = req.params;

    const updatedBooking = await updateBookingDB(
      Number(bookingId),
      role,
      status,
      Number(id)
    );

    return res.status(200).json({
      success: true,
      message:
        status === "returned"
          ? "Booking marked as returned. Vehicle is now available"
          : "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
