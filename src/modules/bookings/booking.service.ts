import { pool } from "../../config/db";
import { BOOKING_QUERIES } from "./booking.sql";
import { CreateBooking } from "./booking.types";

// custom error
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createBookingDB = async (payload: CreateBooking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const vehicleRes = await pool.query(BOOKING_QUERIES.GET_VEHICLE_PRICE, [
    vehicle_id,
  ]);

  if (
    !vehicleRes.rowCount ||
    vehicleRes.rows[0].availability_status !== "available"
  ) {
    throw new Error("Vehicle not available");
  }

  const dailyPrice = Number(vehicleRes.rows[0].daily_rent_price);

  const days =
    (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);

  if (days <= 0) throw new Error("Invalid booking duration");

  const totalPrice = dailyPrice * days;

  const bookingRes = await pool.query(BOOKING_QUERIES.CREATE_BOOKING, [
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    totalPrice,
  ]);

  // 4. Update vehicle status
  await pool.query(BOOKING_QUERIES.UPDATE_VEHICLE_STATUS, [vehicle_id]);

  return {
    ...bookingRes.rows[0],
    total_price: Number(bookingRes.rows[0].total_price),
  };
};

export const getAllBookingsDB = async (userId: number, role: string) => {
  if (role === "admin") {
    const { rows } = await pool.query(`
      SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
      ORDER BY b.id DESC
    `);

    return rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: Number(row.total_price),
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  const { rows } = await pool.query(
    `
 SELECT
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON v.id = b.vehicle_id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
    [userId]
  );

  return rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

export const updateBookingDB = async (
  bookingId: number,
  role: string,
  status: "cancelled" | "returned",
  customerId?: number
) => {
  const bookingRes = await pool.query(BOOKING_QUERIES.GET_BOOKING_BY_ID, [
    bookingId,
  ]);

  if (!bookingRes.rowCount) {
    throw new AppError("Booking not found", 404);
  }

  const booking = bookingRes.rows[0];

  if (role === "customer") {
    if (status !== "cancelled") {
      throw new AppError("Invalid status update", 400);
    }

    if (booking.customer_id !== customerId) {
      throw new AppError("Forbidden", 403);
    }

    if (new Date(booking.rent_start_date) <= new Date()) {
      throw new AppError("Cannot cancel after rent start date", 400);
    }

    const updatedBooking = await pool.query(
      BOOKING_QUERIES.UPDATE_BOOKING_STATUS,
      ["cancelled", bookingId]
    );

    await pool.query(BOOKING_QUERIES.UPDATE_VEHICLE_STATUS, [
      booking.vehicle_id,
    ]);

    return formatCustomerResponse(updatedBooking.rows[0]);
  }

  if (role === "admin") {
    if (status !== "returned") {
      throw new AppError("Invalid status update", 400);
    }

    const updatedBooking = await pool.query(
      BOOKING_QUERIES.UPDATE_BOOKING_STATUS,
      ["returned", bookingId]
    );

    await pool.query(BOOKING_QUERIES.UPDATE_VEHICLE_STATUS, [
      booking.vehicle_id,
    ]);

    return formatAdminResponse(updatedBooking.rows[0]);
  }

  throw new AppError("Unauthorized", 403);
};

const formatCustomerResponse = (row: any) => ({
  id: row.id,
  customer_id: row.customer_id,
  vehicle_id: row.vehicle_id,
  rent_start_date: row.rent_start_date,
  rent_end_date: row.rent_end_date,
  total_price: Number(row.total_price),
  status: row.status,
});

const formatAdminResponse = (row: any) => ({
  id: row.id,
  customer_id: row.customer_id,
  vehicle_id: row.vehicle_id,
  rent_start_date: row.rent_start_date,
  rent_end_date: row.rent_end_date,
  total_price: Number(row.total_price),
  status: row.status,
  vehicle: {
    availability_status: "available",
  },
});
