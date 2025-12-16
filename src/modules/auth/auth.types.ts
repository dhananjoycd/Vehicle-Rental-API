export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  role: "admin" | "customer";
}
