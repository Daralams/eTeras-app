import { Sequelize, DataTypes } from 'sequelize'
import db from '../Database/DbConnection.js'
import Conversation from './ConversationModel.js'

const Chats = db.define('chats', {
  conversationId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { freezeTableName: true })

Conversation.hasMany(Chats)
Chats.belongsTo(Conversation)

export default Chats