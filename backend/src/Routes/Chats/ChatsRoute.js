import express from 'express'
import { 
  showConversationsUserIsLoggin, 
  showConversationContentById, 
  sendMessage,
  conversationByMachedUserId
} from '../../Controllers/Chats/ChatsController.js'

const ChatsRouter = express.Router()
ChatsRouter.get('/chats/:id_user', showConversationsUserIsLoggin)
ChatsRouter.get('/chats/content/:id_conversation', showConversationContentById)
ChatsRouter.post('/chats/content', sendMessage)
ChatsRouter.get('/chats/content/:user1/:user2', conversationByMachedUserId)

export default ChatsRouter