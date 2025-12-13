// src/server.ts
import express from "express";
import { env } from "./config/env";
import { initDBConnection } from "./config/db";

const app = express();
initDBConnection();

//Middleware

//CRUD operation : Root Routes Define
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/vehicles', vehicleRoutes);
// app.use('/api/v1/bookings', bookingRoutes);

app.listen(env.PORT, () => {
  console.log(`Ready to do! Server running on port ${env.PORT}`);
});
