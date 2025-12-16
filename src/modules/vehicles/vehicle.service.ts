import { pool } from "../../config/db";
import { VehiclePayLoad } from "./vehicle.type";

export const createVehicleDB = async (payload: VehiclePayLoad) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const { rows } = await pool.query(
    `
    INSERT INTO vehicles
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  const vehicle = rows[0];

  return {
    ...vehicle,
    daily_rent_price: Number(vehicle.daily_rent_price),
  };
};

export const getAllVehiclesDB = async () => {
  const { rows } = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return rows;
};

export const getVehicleByIdDB = async (id: number) => {
  const { rows } = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    id,
  ]);
  return rows;
};

export const updateVehicleDB = async (id: number, payload: VehiclePayLoad) => {
  const fields = Object.keys(payload);
  const values = Object.values(payload);

  const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

  const { rowCount, rows } = await pool.query(
    `UPDATE vehicles SET ${setQuery} WHERE id = $${
      fields.length + 1
    } RETURNING *`,
    [...values, id]
  );

  if (rowCount) {
    return [
      {
        ...rows[0],
        daily_rent_price: Number(rows[0].daily_rent_price),
      },
    ];
  } else return rows;
};

export const deleteVehicleDB = async (id: number) => {
  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
};
