import {Sequelize, DataTypes} from 'sequelize'
import db from '../Database/DbConnection.js'
import Comments from './CommentsModel.js'
import Users from './UsersModel.js'

const ReplyComment = db.define('reply_comment', {
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentReplyId: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  referenced_username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
})

// reply_comment tb relationship
ReplyComment.hasMany(ReplyComment, { foreignKey: 'parentReplyId'})
Comments.hasMany(ReplyComment)
ReplyComment.belongsTo(Comments)
Users.hasMany(ReplyComment)
ReplyComment.belongsTo(Users)


export default ReplyComment