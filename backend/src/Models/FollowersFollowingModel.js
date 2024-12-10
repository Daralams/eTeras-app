import { Sequelize, DataTypes, BOOLEAN } from "sequelize";
import db from "../Database/DbConnection.js";
import Users from "./UsersModel.js";

const FollowersFollowing = db.define(
  "followers_following",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId_followers: {
      type: DataTypes.INTEGER,
    },
    userId_following: {
      type: DataTypes.INTEGER,
    },
    state_followers: {
      type: BOOLEAN,
      defaultValue: false,
    },
    state_following: {
      type: BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(FollowersFollowing);
FollowersFollowing.belongsTo(Users, {
  foreignKey: "userId_followers",
  as: "followers",
});
FollowersFollowing.belongsTo(Users, {
  foreignKey: "userId_following",
  as: "following",
});

export default FollowersFollowing;
