import { Sequelize } from "sequelize";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../config/config.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

export async function checkConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates tables if they don't exist
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error.message);
  }
}
