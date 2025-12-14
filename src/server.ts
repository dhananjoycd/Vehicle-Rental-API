// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { initDBConnection } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Base initiate
initDBConnection();

//CRUD operation : Root Routes Define
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
// app.use('/api/v1/vehicles', vehicleRoutes);
// app.use('/api/v1/bookings', bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Dear! The root route is open for all ...",
    path: req.path,
  });
});

app.listen(env.PORT, () => {
  console.log(`Ready to do! Server running on port ${env.PORT}`);
});
