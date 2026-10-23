import { config } from "dotenv";
import { Pool, types } from "pg";
config();

types.setTypeParser(1082, (value) => value);

const PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

export const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  port: PORT,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});
