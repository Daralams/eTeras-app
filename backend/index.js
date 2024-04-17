import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

dotenv.config()
const port = 3000
const app = express()
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

app.listen(port, () => console.log(`Server running on port ${port}...`))