import express from 'express'
import {
  getCommentsById,
  comments,
  editComment,
  deleteComment
} from '../../Controllers/Comments/CommentsController.js'

const CommentsRouter = express.Router()
CommentsRouter.get('/posts/comments/:postId', getCommentsById)
CommentsRouter.post('/posts/comments/:id', comments)
CommentsRouter.patch('/posts/comments/:id', editComment)
CommentsRouter.delete('/posts/comments/:id', deleteComment)

export default CommentsRouter