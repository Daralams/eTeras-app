import {Sequelize} from 'sequelize'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import Users from '../../Models/UsersModel.js'
import Posts from '../../Models/PostsModel.js'
import Category from '../../Models/CategoryModel.js'
import Likes from '../../Models/LikesModel.js'

export const dashboard = async (req, res) => {
  try {
    // ini digunakan utk menampilkan semua post berdasarkan user yg login 
    res.status(200).json({msg: 'Your dashboard'})
  }catch (error) {
    console.error(error.message)
  }
}

export const getUser = async (req, res) => {
  try {
    const response = await Users.findAll({
      where: {
        username: req.params.username
      },
      include: Posts,
      order: [['createdAt', 'DESC']]
    })
    if(response.length === 0) {
      throw new Error(`No post by : ${req.params.username}`)
    }
    res.status(200).json([{msg: `Author : ${req.params.username}`}, {data: response}])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

// activity user is loggin. (like posts and comments) 
export const favoritedPosts = async(req, res) => {
  try {
    const getLikesData = await Likes.findAll({
      attributes: ['postId', 'userId', 'status'],
      where: {
        userId: req.params.userId,
        status: 1
      },
      include: {
        model: Posts,
        include: [{model: Users}, {model: Category}]
      }
    })
    res.status(200).json({data: getLikesData})
  }catch (error) {
    console.log(error.message)
  }
} 

// get profile other user to see profile other user account
export const getProfileOtherUser = async(req, res) => {
  const request = await Users.findOne({
    attributes: { exclude: ['password', 'confirmPw', 'refresh_token', 'updatedAt'] },
    where: {
      id: req.params.id
    },
    include: {
      model: Posts,
      attributes: ['id']
    }
  })
  res.status(200).json({userProfile: request})
}