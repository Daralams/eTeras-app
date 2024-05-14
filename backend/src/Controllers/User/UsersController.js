import {Sequelize} from 'sequelize'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import Users from '../../Models/UsersModel.js'
import Posts from '../../Models/PostsModel.js'
import Category from '../../Models/CategoryModel.js'
import Likes from '../../Models/LikesModel.js'
import Comments from '../../Models/CommentsModel.js'
import ReplyComment from '../../Models/ReplyCommentModel.js'

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

// show favorite posts user is loggin 
export const favoritedPosts = async(req, res) => {
  try {
    const checkUserId = await Users.findOne({ where: { id: req.params.userId } })
    if(!checkUserId) return res.sendStatus(404)
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

// show comments user is loggin
export const commentsHistory = async(req, res) => {
  try {
    const checkUserId = await Users.findOne({ where: { id: req.params.userId} })
    if(!checkUserId) return res.sendStatus(404)
    
    // const getCommentsHistory = await Comments.findAll({
    //   where: { userId: req.params.userId },
    //   include: [
    //     {model: Posts}, 
    //     {model: ReplyComment
    //     }]
    // })
    
    // percobaan
    // problem query ini: 
    // 1. Gabisa nampilin comment yg ga memiliki ReplyComment
    const getCommentsHistory = await Posts.findAll({
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {model: Users,
          attributes: ['id', 'username']
        },{
        model: Comments,
        required: true,
        // where: { userId: req.params.userId },
          include: [{
            model: ReplyComment,
            where: { userId: req.params.userId },
            include: {model: Users,
              attributes: ['id', 'username']
            }
            // required: false 
          }, 
          {model: Users,
            attributes: ['id', 'username']
          }]
        }]
    })
    
    // const getReplyOtherUserHistory = await ReplyComment.findAll({
    //   where: { userId: req.params.userId},
    //   include: [
    //     {model: Comments, 
    //     include: { model: Posts }}
    //     ] 
    // })
    
    // if(response.length == 0) {
    //   const replyToOtherUser = await ReplyComment.findAll({ where: {userId: req.params.userId} })
    //   return res.status(200).json({ data : replyToOtherUser })
    // }
    
    res.status(200).json({posts: getCommentsHistory})
  }catch(error) {
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