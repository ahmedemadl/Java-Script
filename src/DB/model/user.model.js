import { DataTypes } from "sequelize";
import { sequelize } from "../connection.db.js";

// Users -> using sequelize.define
export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "Invalid email format" } }, // built-in validation
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // custom validation method
        checkPasswordLength(value) {
          if (!value || value.length <= 6) {
            throw new Error("Password must be greater than 6 characters");
          }
        },
      },
    },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      // custom validation method inside the beforeCreate hook
      beforeCreate: function checkNameLength(user) {
        if (!user.name || user.name.length <= 2) {
          throw new Error("Name must be greater than 2 characters", {
            cause: { status: 400 },
          });
        }
      },
    },
  }
);
