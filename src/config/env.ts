import dotenv from "dotenv";
import path from "path";
dotenv.config();

dotenv.config({ path: path.join(process.cwd(), ".env") });

//safe guard for env file
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: process.env.PORT || 3000,
  DB_STRING: requireEnv("DB_CONNECTION"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: requireEnv("JWT_EXPIRES_IN"),
};
