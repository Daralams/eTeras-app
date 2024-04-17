import db from '../Database/DbConnection.js'
import {Sequelize, DataTypes} from 'sequelize'

const Users = db.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email : {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  confirmPw: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refresh_token: DataTypes.TEXT
})

export default Users

