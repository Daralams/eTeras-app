import {Sequelize, Op} from "sequelize"
import Posts from "../../Models/PostsModel.js"
import Users from "../../Models/UsersModel.js"
import Category from "../../Models/CategoryModel.js"
import Likes from "../../Models/LikesModel.js"
import Comments from "../../Models/CommentsModel.js"
import ReplyComment from "../../Models/ReplyCommentModel.js"

export const getPost = async (req, res) => {
  try {
    const response = await Posts.findAll()
    if(response.length === 0) {
      throw new Error("No data available")
    }
    res.status(200).json({data: response})
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

export const getPostById = async(req, res) => {
  try {
    const response = await Posts.findOne({
      where: {
        id: req.params.id
      }
    })
    if(!response) return res.status(404).json({msg: `Post with id : ${req.params.id} not found!`})
    res.status(200).json([response])
  }catch (error) {
    console.error(error.message)
  }
}

// get all data and join with other table 
export const getPosts = async (req, res) => {
  try {
    const response = await Posts.findAll({
      include: [
        {model: Users},
        {model: Category},
        {model: Likes, 
          where: {
            status: 1
          },
          required: false
        },
        {model: Comments, 
        include: 
          {model: ReplyComment},
          include: {model: Users}
        }],
      order: [['createdAt', 'DESC']]
    })
    if(response.length === 0) {
      throw new Error("No Post available")
    }
    res.status(200).json([
      {msg: "All post"},
      {data: response}])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

export const getPostBySlug = async (req, res) => {
  try {
    const response = await Posts.findOne({
      where: {
        slug: req.params.slug
      },
      include: [
        {model: Users}, 
        {model:Category}, 
        {model: Comments, 
        include: [
        {model: Users},
        {model: ReplyComment, 
          include: {model: Users}}
        ]}
        ]
    })
    
    if(!response) {
      throw new Error(`Your request : ${req.params.slug}, Not found!`)
    }
    res.status(200).json([response])
   } catch (error) {
    res.status(404).json({error: error.message})
  }
}

export const createNewPost = async (req, res) => {
  try {
    const postData = {
      categoryId: req.body.categoryId,
      userId: req.body.userId,
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content
    }
    // post validation
    if(postData.title.length <= 3 ) return res.status(500).json({msg: "Title must be more than 3 characters!"})
    
    if(postData.categoryId.length < 1 ) return res.status(500).json({msg: "Please select category!"})
    
    const request = await Posts.create(req.body)
    
    res.status(201).json([
      {msg: "New Post created successfully"},
      {data: request}])
  } catch (error) {
    console.error(error.message)
  }
}

export const editPost = async (req, res) => {
  try {
    const idParams = req.params.id
    if(!idParams) return res.status(500).json({msg: "Id parameter missing!"})
    const reqParams = await Posts.findOne({
      where: {
        id: idParams
      }
    })
    
    if(!reqParams) return res.status(404).json({msg: "Post not found!"})
    
    const postData = {
      categoryId: req.body.categoryId,
      userId: req.body.userId,
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content
    }
    // post validation
    if(postData.title.length <= 3 ) return res.status(500).json({msg: "Title must be more than 3 characters!"})
    if(postData.categoryId.length < 1 ) return res.status(500).json({msg: "Please select category!"})
    
    const request = await Posts.update(req.body, {
      where: {
        id: idParams
      }
    })
    
    res.status(200).json([
      {msg: "Post updated successfully"},
      {data: req.body}
      ])
  } catch(error) {
    console.error(error.message)
  }
}

export const deletePost = async (req, res) => {
  try {
    const response = await Posts.destroy({
      where: {
        id: req.params.id
      }
    })
    if(!response) {
      throw new Error(`Your request ${req.params.id} Not Found`)
    }
    res.status(200).json(
      {msg: 'Your post has been deleted'})
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}