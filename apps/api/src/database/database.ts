import { config } from "dotenv";
import { Pool } from "pg";
config();

const PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

export const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  port: PORT,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});
