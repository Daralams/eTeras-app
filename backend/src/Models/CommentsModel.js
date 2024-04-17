import {Sequelize, DataTypes} from 'sequelize'
import db from '../Database/DbConnection.js'
import Posts from './PostsModel.js'
import Users from './UsersModel.js'

const Comments = db.define('comments', {
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
})

// comments table relationship
Posts.hasMany(Comments)
Comments.belongsTo(Posts)

Users.hasMany(Comments)
Comments.belongsTo(Users)

export default Comments