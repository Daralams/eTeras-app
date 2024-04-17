import express from 'express'
import {
  replyMainComment,
  editReplyMainComment,
  deleteReplyMainComment,
  repliesToReplies
} from '../../Controllers/Comments/RepliesController.js'

const ReplyRoutes = express.Router()
// reply main comment 
ReplyRoutes.post('/posts/reply-comment/:id', replyMainComment)
ReplyRoutes.patch('/posts/reply-comment/:id', editReplyMainComment)
ReplyRoutes.delete('/posts/reply-comment/:id', deleteReplyMainComment)
// replies to replies 
ReplyRoutes.post('/posts/reply-comment/:id/:commentId', repliesToReplies)


export default ReplyRoutes