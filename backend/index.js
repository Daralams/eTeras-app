import express from "express"
import { createServer } from 'node:http'
import cors from "cors"
import dotenv from "dotenv"
import { Server } from "socket.io"
import cookieParser from "cookie-parser"

// authentication route
import auth from './src/Routes/Auth/AuthRoute.js'
// user route
import user from './src/Routes/User/UsersRoute.js'
// posts route
import PostRouter from "./src/Routes/Posts/PostRoute.js"
import CategoryRouter from "./src/Routes/Posts/CategoryRoute.js"
// comments Routes
import CommentsRouter from "./src/Routes/Comments/CommentsRoute.js" 
import ReplyRoutes from "./src/Routes/Comments/RepliesRoute.js"
// like dislike routes 
import likeDislikePostRouter from "./src/Routes/Likes/LikesRoute.js"
// search Posts
import searchRoute from "./src/Routes/Search/SearchRoute.js"
// chats 
import ChatsRouter from "./src/Routes/Chats/ChatsRoute.js"

// likes 
import { likeDislikePost } from './src/Controllers/Likes/LikesController.js'
// comments realtime 
import {
  getCommentsById,
  comments
} from './src/Controllers/Comments/CommentsController.js'
// chats realtime
import { 
  showConversationsUserIsLoggin,
  showConversationContentById,
  sendMessage 
} from './src/Controllers/Chats/ChatsController.js' 

dotenv.config()
const port = 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: 'http://localhost:5173'
  }
})
app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
app.use(express.json())
app.use(auth)
app.use(user)
app.use(PostRouter)
app.use(CategoryRouter)
app.use(CommentsRouter)
app.use(ReplyRoutes)
app.use(likeDislikePostRouter)
app.use(searchRoute)
app.use(ChatsRouter)

let status = ''
io.on('connection', (socket) => {
  status = 'Online'
  console.log(status)
  console.log('User connected, id: ' + socket.id)
  
  // comments realtime 
  socket.on('send-comment', async(sendComment) => {
    console.log(sendComment)
    await comments({ body: sendComment }, {
      status: (code) => ({ json: (response) => console.log(response) })
    })
    // msh terus mencoba derr 
    const receiveComments = await getCommentsById(sendComment.postId)
    console.log(receiveComments)
    socket.broadcast.emit('get-comments', receiveComments)
    // socket.broadcast.emit('get-comments', sendComment)
  })
  
  // recent chats ~ send user id is login for get recent chats ~ blm bener ngaff (kerjain komen dlu)
  socket.on('send-userIdIsLoggin', async(userIdIsLoggin) => {
    console.log('User sedang login id: ' + userIdIsLoggin)
    await showConversationsUserIsLoggin(userIdIsLoggin)
    
    // show recent chats by user id is login
    socket.broadcast.emit('recent-chats', userIdIsLoggin)
  })
  
  // chatting 
  socket.on('send-message', async (msg_data) => {
    console.log(msg_data)
    // Call the sendMessage function and pass the message data
    await sendMessage({ body: msg_data }, {
      status: (code) => ({ json: (response) => console.log(response) })
    })
    socket.broadcast.emit('receive-message', msg_data)
  })
  
  socket.on('disconnect', () => {
    status = 'Offline'
    console.log(status)
  })
})

server.listen(port, () => console.log(`Server running on port ${port}...`))