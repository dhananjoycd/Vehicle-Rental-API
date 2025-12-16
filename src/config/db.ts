// src/config/db.ts
import { Pool } from "pg";
import config from "../app";

export const pool = new Pool({
  connectionString: `${config.db_string}`,
});

// DB connection
export async function initDBConnection() {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP DEFAULT NOW(),
         updated_at TIMESTAMP DEFAULT NOW()
        )       
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')), 
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price >= 0),
        availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT NOW()
        ) `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    vehicle_id INTEGER NOT NULL
        REFERENCES vehicles(id)
        ON DELETE CASCADE,

    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,

    total_price NUMERIC(12,2) NOT NULL
        CHECK (total_price >= 0),

    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'cancelled', 'returned')),

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CHECK (rent_end_date > rent_start_date)
    )
 `);
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
