import express from 'express'
import {searchPosts} from '../../Controllers/Search/SearchController.js'
const searchRoute = express.Router()

searchRoute.get('/search/posts', searchPosts)
export default searchRoute