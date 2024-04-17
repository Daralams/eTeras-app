import express from 'express'
import {
  comments,
  editComment,
  deleteComment
} from '../../Controllers/Comments/CommentsController.js'

const CommentsRouter = express.Router()
CommentsRouter.post('/posts/comments/:id', comments)
CommentsRouter.patch('/posts/comments/:id', editComment)
CommentsRouter.delete('/posts/comments/:id', deleteComment)

export default CommentsRouter