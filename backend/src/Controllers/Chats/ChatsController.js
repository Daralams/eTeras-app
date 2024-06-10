import { Sequelize } from 'sequelize'
import Chats from '../../Models/ChatsModel.js'
import Conversation from '../../Models/ConversationModel.js'
import Users from '../../Models/UsersModel.js'

export const showConversationsUserIsLoggin = async(req, res) => {
  try {
    const userIsLoggin = await Conversation.findAll({
      where: {
        [Sequelize.Op.or]: [
          { userId_1: req.params.id_user },
          { userId_2: req.params.id_user }
          ]
      },
      include: [
        {
          model: Chats,
          attributes: ['id', 'sender_id', 'receiver_id', 'message']
        },
        {
          model: Users,
          as: 'UserId1',
          where: {
            id: {
              [Sequelize.Op.ne]: req.params.id_user
            }
          },
          required: false
        },
        {
          model: Users,
          as: 'UserId2',
          where: {
            id: {
              [Sequelize.Op.ne]: req.params.id_user
            }
          },
          required: false
        }
      ]
    })
    
    if(!userIsLoggin) return res.status(401).json({ error: 'User is not registered!' })
    
    const result = userIsLoggin.map(conversation => {
      let interlocutor = conversation.UserId1 ? conversation.UserId1 : conversation.UserId2
      return {
        id: conversation.id,
        recent_chat: conversation.chats.slice(-1)[0],
        date: conversation.createdAt,
        interlocutor: interlocutor ? { // pengecekan opsional
          id: interlocutor.id,
          name: interlocutor.username
        } : null
      }
    }).filter(conversation => conversation.interlocutor !== null) // ini juga opsional
    res.status(200).json({ data: result })
  }catch(error) {
    console.log(error.message)
  }
}

export const showConversationContentById = async(req, res) => {
  try {
    const response = await Conversation.findOne({
      where: { id: req.params.id_conversation },
      include: { model: Chats }
    })
    
    if(!response) return res.status(404).json({ error: 'Conversation Id not found!' })
    
    res.status(200).json({ data: response })
  }catch(error) {
    console.log(error.message)
  }
}

export const sendMessage = async(req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body 
    
    // validation sender_id or receiver_id if undefined 
    if(!sender_id || !receiver_id) {
      return res.status(400).json([
        { status: "Failed" },
        { msg: "Failed save message, sender id or receiver id is not defined!"}])
    }
    
    // validation if sender_id == receiver_id
    if(sender_id === receiver_id) {
      return res.status(400).json([
        { status: "Failed" },
        { msg: "Failed save message, sender id can't same with receiver id!"}])
    }
    
    // validation message if undefined or empty string 
    if(!message || message.trim().length < 1) {
      return res.status(400).json([
        { status: "Failed" },
        { msg: "Failed to save message, message must be longer than 1 character" }
        ]) 
    }
    
    // cek keberadaan userId_1 dan userId_2 pada db Conversation
    let conversation = await Conversation.findOne({
      where: {
        userId_1: sender_id,
        userId_2: receiver_id
      }
    })
    
    if(!conversation) {
      conversation = await Conversation.findOne({
        where: {
          userId_1: receiver_id,
          userId_2: sender_id
        }
      })
    }
    // jika belum ada percakapan, buat percakapan baru
    if(!conversation) {
      conversation = await Conversation.create({
        userId_1: sender_id,
        userId_2: receiver_id
      })
    }
    
    // jika sudah ada buat message pada percakapan 
    const saveMessage = await Chats.create({
      conversationId: conversation.id,
      sender_id,
      receiver_id,
      message
    })
    
    const saveMessageSuccess = [saveMessage]
    res.status(201).json([
        { status: 'success' },
        { msg: 'New chat message created success' },
        { 
          data: saveMessageSuccess.map(chatData => ({
            id: chatData.id,
            conversation_id: chatData.conversationId
          })) 
        }
      ])
  }catch(error) {
    console.log(error.message)
  }
}

export const conversationByMachedUserId = async(req, res) => {
  const { user1, user2 } = req.params
  
  let request = await Conversation.findOne({
    attributes: ['id'],
    where: {
      userId_1: req.params.user1 ,
      userId_2: req.params.user2 
    }
  })
  
  if(!request) {
    request = await Conversation.findOne({
      attributes: ['id'],
      where: {
        userId_1: req.params.user2 ,
        userId_2: req.params.user1 
      }
    })
  }
  
  res.status(200).json([
    { status: 'success' },
    { data: request }
    ])
}