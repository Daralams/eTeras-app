import { Sequelize, DataTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import db from '../Database/DbConnection.js'
import Users from './UsersModel.js'

const Conversation = db.define('conversation', {
  id: {
    type: DataTypes.STRING,
    defaultValue: () => uuidv4().replace(/-/g, ''),
    primaryKey: true
  },
  userId_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id'
    }
  },
  userId_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id'
    }
  }
}, { freezeTableName: true })

// Users.hasMany(Conversation, { foreignKey: 'userId_1' })
// Users.hasMany(Conversation, { foreignKey: 'userId_2' })
// Conversation.belongsTo(Users, { foreignKey: 'userId_1' })
// Conversation.belongsTo(Users, { foreignKey: 'userId_2' })
Conversation.belongsTo(Users, { as: 'UserId1', foreignKey: 'userId_1' })
Conversation.belongsTo(Users, { as: 'UserId2', foreignKey: 'userId_2' })
Users.hasMany(Conversation, { as: 'UserId1Conversations', foreignKey: 'userId_1' })
Users.hasMany(Conversation, { as: 'UserId2Conversations', foreignKey: 'userId_2' })

export default Conversation