import express from 'express'
import {
  dashboard,
  getUser,
  userIsLoggin,
  favoritedPosts,
  getProfileOtherUser
} from '../../Controllers/User/UsersController.js'
import {refreshToken} from '../../Controllers/RefreshToken.js'
import {verifyToken} from '../../Middleware/verifyToken.js'

const user = express.Router()
user.get('/dashboard', verifyToken, dashboard)
user.get('/author/:username', getUser)
user.get('/profile', verifyToken, userIsLoggin)
user.get('/profile/:id/fav-posts', favoritedPosts)
user.get('/token', refreshToken)
user.get('/other-profile-user/:id', getProfileOtherUser)


export default user

