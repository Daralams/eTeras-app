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

// untuk keperluan chats realtime
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