export const BOOKING_QUERIES = {
  GET_VEHICLE_PRICE: `
    SELECT daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
  `,

  CREATE_BOOKING: `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,

  UPDATE_VEHICLE_STATUS: `
  UPDATE vehicles SET availability_status = 'booked' WHERE id = $1
  `,

  GET_ALL_BOOKINGS_ADMIN: `
    SELECT b.*, u.name AS customer_name, v.vehicle_name
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
  `,

  GET_CUSTOMER_BOOKINGS: `
    SELECT b.*, v.vehicle_name, v.registration_number
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
  `,

  UPDATE_BOOKING_STATUS: `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *
  `,

  GET_BOOKING_BY_ID: `
    SELECT * FROM bookings WHERE id = $1
  `,
};
