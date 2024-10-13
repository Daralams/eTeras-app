import db from "../Database/DbConnection.js";
import { Sequelize, DataTypes } from "sequelize";

const Users = db.define("user", {
  username: {
    unique: true,
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  confirmPw: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  profile_photo_name: DataTypes.TEXT,
  profile_photo_url: DataTypes.TEXT,
  about: DataTypes.TEXT,
  date_of_birth: DataTypes.DATE,
  refresh_token: DataTypes.TEXT,
});

export default Users;
