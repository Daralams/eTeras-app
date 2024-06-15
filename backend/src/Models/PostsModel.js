import {Sequelize, DataTypes} from "sequelize"
import db from "../Database/DbConnection.js"
import Category from "./CategoryModel.js"
import Users from "./UsersModel.js"

const Posts = db.define('posts', {
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  imageName: DataTypes.TEXT,
  imageUrl: DataTypes.TEXT,
  content: DataTypes.TEXT
}, {
  freezeTableName: true
})

Users.hasMany(Posts)
Posts.belongsTo(Users)

Category.hasMany(Posts)
Posts.belongsTo(Category)

export default Posts