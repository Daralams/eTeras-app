import express from "express"
import {
  getCategory,
  getCategoryBySlug,
  createCategory,
  editCategory
} from "../../Controllers/Posts/CategoryController.js"
const CategoryRouter = express.Router()

CategoryRouter.get('/category', getCategory)
CategoryRouter.get('/category/:slug', getCategoryBySlug)
CategoryRouter.post('/category', createCategory)
CategoryRouter.patch('/category/edit/:id', editCategory)

export default CategoryRouter