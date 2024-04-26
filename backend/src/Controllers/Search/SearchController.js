import {Sequelize, Op} from 'sequelize'
import Posts from '../../Models/PostsModel.js'
import Category from '../../Models/CategoryModel.js'
import Users from '../../Models/UsersModel.js'

// search : posts, category, author
export const searchPosts = async(req, res) => {
  const searchKey = req.query.key
  if (!searchKey || searchKey.trim() === " ") {
    return res.status(400).json({ error: "Please provide a search term" });
  }
  
  const findPostByKey = await Posts.findAndCountAll({
    include: [
      {model: Category,
      attributes: ['name', 'slug']},
      {model: Users,
      attributes: ['username']}
      ],
    where: {
      [Op.or] : [
        { title: { [Op.like]:`%${searchKey}%`} },
        { '$category.name$': { [Op.like]: `%${searchKey}%`} },
        { '$user.username$': { [Op.like]: `%${searchKey}%`} }
        ]
    }
  })
  
  if(findPostByKey.count == 0) return res.status(404).json({error : `No result for : ${searchKey}`})
  return res.status(200).json({data: findPostByKey})
}