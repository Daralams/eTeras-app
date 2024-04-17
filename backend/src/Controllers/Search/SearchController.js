import {Sequelize} from 'sequelize'
import Posts from '../../Models/PostsModel.js'

export const searchPosts = async(req, res) => {
  console.log(req.query)
  res.send('Hai ' + req.query)
}