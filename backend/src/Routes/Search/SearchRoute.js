import express from 'express'
import {searchPosts, searchAuthor} from '../../Controllers/Search/SearchController.js'
const searchRoute = express.Router()

searchRoute.get('/search/posts', searchPosts)
searchRoute.get('/search/author', searchAuthor)
export default searchRoute