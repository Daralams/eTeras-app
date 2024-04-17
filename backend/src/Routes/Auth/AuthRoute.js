import express from 'express'
import {
  register,
  login,
  logout
  } from '../../Controllers/Auth/AuthController.js'

const auth = express.Router()

auth.post('/register', register)
auth.post('/login', login)
auth.delete('/logout', logout)

export default auth