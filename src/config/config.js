import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path:
    process.env.NODE_ENV == "PROD"
      ? path.resolve("./.env.prod")
      : path.resolve("./.env.dev"),
});

export const PORT = Number(process.env.PORT) || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_NAME = process.env.DB_NAME || "assignment5";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
