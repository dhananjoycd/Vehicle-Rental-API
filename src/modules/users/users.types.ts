export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  email?: string;
  role?: "admin" | "customer"; // admin only
  password?: string;
}
