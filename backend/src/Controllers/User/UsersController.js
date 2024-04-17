import {Sequelize} from 'sequelize'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import Users from '../../Models/UsersModel.js'
import Posts from '../../Models/PostsModel.js'
import Category from '../../Models/CategoryModel.js'

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

export const userIsLoggin = async(req, res) => {
  try {
    res.status(200).json({msg: 'Your profile'})
  }catch(error) {
    console.error(error.message)
  }
}