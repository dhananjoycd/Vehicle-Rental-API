export type BookingStatus = "active" | "cancelled" | "returned";

export interface CreateBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface UpdateBookingStatus {
  status: BookingStatus;
}

export interface AuthUser {
  id: number;
  role: "admin" | "customer";
}
