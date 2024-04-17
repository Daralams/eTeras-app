import {Sequelize, DataTypes} from "sequelize"
import db from "../Database/DbConnection.js"

const Category = db.define('category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
})

export default Category