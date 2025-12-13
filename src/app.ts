import { env } from "./config/env";

const config = {
  db_string: env.DB_STRING,
  port: env.PORT,
  //   jwt scret key
};

export default config;
