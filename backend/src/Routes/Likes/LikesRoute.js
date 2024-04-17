import express from 'express'
import {getLikes, likeDislikePost} from '../../Controllers/Likes/LikesController.js'
const likeDislikePostRouter = express.Router()

likeDislikePostRouter.get('/like-dislike', getLikes)
likeDislikePostRouter.post('/posts/like-dislike', likeDislikePost)

export default likeDislikePostRouter