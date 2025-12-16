import { pool } from "../../config/db";
import { BOOKING_QUERIES } from "./booking.sql";
import { CreateBooking } from "./booking.types";

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
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...bookingRes.rows[0],
    total_price: Number(bookingRes.rows[0].total_price),
  };
};

/* export const getBookingsDB = async (userId: number, role: string) => {
  const query =
    role === "admin"
      ? `SELECT * FROM bookings ORDER BY id DESC`
      : `SELECT * FROM bookings WHERE user_id = $1 ORDER BY id DESC`;

  const { rows } =
    role === "admin"
      ? await pool.query(query)
      : await pool.query(query, [userId]);

  return rows.map((b) => ({
    ...b,
    total_price: Number(b.total_price),
  }));
};

export const updateBookingDB = async (bookingId: number, role: string) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (!bookingRes.rowCount) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  // CUSTOMER → cancel
  if (role === "customer") {
    if (new Date(booking.start_date) <= new Date()) {
      throw new Error("Cannot cancel after start date");
    }

    await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [
      bookingId,
    ]);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return "cancelled";
  }

  // ADMIN → returned
  await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [
    bookingId,
  ]);

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [booking.vehicle_id]
  );

  return "returned";
};
 */
