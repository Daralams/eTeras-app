import express from 'express'
import {
  dashboard,
  favoritedPosts,
  getUser,
  getProfileOtherUser
} from '../../Controllers/User/UsersController.js'
import {refreshToken} from '../../Controllers/RefreshToken.js'
import {verifyToken} from '../../Middleware/verifyToken.js'

const user = express.Router()
user.get('/dashboard', verifyToken, dashboard)
user.get('/profile/:userId/fav-posts', favoritedPosts)
user.get('/author/:username', getUser)
user.get('/token', refreshToken)
user.get('/other-profile-user/:id', getProfileOtherUser)

export default user

