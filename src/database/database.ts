import { config } from "dotenv";
import { Pool } from "pg";
config();

export const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  port: Number(process.env.DB_PORT) ?? undefined,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});
