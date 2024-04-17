import {Sequelize, DataTypes} from 'sequelize'
import db from '../Database/DbConnection.js'
import Posts from './PostsModel.js'
import Users from './UsersModel.js'

const Likes = db.define('likes', {
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: DataTypes.BOOLEAN(true, false)
}, {freezeTableName: true})

Posts.hasMany(Likes)
Likes.belongsTo(Posts)

Users.hasMany(Likes)
Likes.belongsTo(Users)

export default Likes
