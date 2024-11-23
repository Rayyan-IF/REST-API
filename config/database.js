import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

export const database = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
