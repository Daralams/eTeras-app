import db from "../../Database/DbConnection.js"
import Category from "../../Models/CategoryModel.js"
import Posts from "../../Models/PostsModel.js"

export const getCategory = async (req, res) => {
  try {
    const response = await Category.findAll()
    if(response.length === 0) {
      throw new Error(`Category Not Available`)
    }
    res.status(200).json([
      {msg: 'All category'},
      {data: response}])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

// filter category based on name 
export const getCategoryBySlug = async(req, res) => {
  try {
    const categorySlug = await Category.findAll({
      where: {
        slug: req.params.slug
      },
      include: Posts
    })
    
    if(categorySlug.length === 0) {
      throw new Error(`Your request Category : ${req.params.slug}, not found!`)
    }
    // Tahap perbaikan !!
    // console.log(categoryName[0])
    // Check if any posts exist for the category
    // if (categoryName[0].Posts.length === 0) {
    //   return res.status(200).json([
    //     { msg: `Posts for category ${req.params.name} are not available` },
    //     { data: categoryName }
    //   ])
    // }
    res.status(200).json([
      {msg: `You search : ${req.params.slug}`},
      {data: categorySlug}])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}


export const createCategory = async (req, res) => {
  try {
    const request = await Category.create(req.body)
    res.status(201).json([
      {msg: "New category created successfully"},
      {data: request}])
  } catch(error) {
    res.status(500).json({error: error.message})
  }
}

export const editCategory = async (req, res) => {
  try {
    const idParams = req.params.id
    if(!idParams) {
      throw new Error('Missing request id')
    }
    const reqParams = await Category.findOne({
      where: {
        id: idParams
      }
    })
    
    if(!reqParams) {
      throw new Error("Category not found!")
    }
    
    const request = await Category.update(req.body, {
      where : {
        id: idParams
      }
    })
    
    res.status(200).json([
      {msg: `Category updated successfully`},
      {data: req.body}])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}
