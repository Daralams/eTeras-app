import express from 'express'
import {searchPosts} from '../../Controllers/SearchController'
const searchRoute = express.Router()

searchRoute.get('/posts/searchPost/search?q=', searchPosts)
export default searchRoute