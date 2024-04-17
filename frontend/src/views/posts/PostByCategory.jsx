import {Link, useParams} from "react-router-dom"
import React, {useState, useEffect} from "react"
import axios from "axios"
// components 
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function PostByCategory () {
  const [postByCategory, setPostByCategory] = useState([])
  const [message, setMessage] = useState([])
  const {slug} = useParams()
  
  useEffect(() => {
    getPostByCategory()
  }, [])
  
  const getPostByCategory = async () => {
    const postCategory = await axios.get(`http://localhost:3000/category/${slug}`)
    setPostByCategory(postCategory.data[1].data)
    console.log(postCategory.data[1].data)
  }
  
  return (
    <>
    <Navbar/>
    <div className="p-3">
      <div className="flex flex-wrap gap-3">
      {postByCategory.map(post => (
         <div className="border-2 rounded-md p-2">
      <div className="overflow-hidden rounded">
        {/*<img src={ImgCard} alt="postimages"/>*/}
      </div>
      <div className="p-4" key={post.id}>
        <h1 className="fs-4 font-bold mb-2">{post.posts[0].title}</h1>
        <p className="text-slate-400 mb-2">{post.posts[0].createdAt}</p>
        <p className="text-sm mb-4">- {post.name}</p>
        <Link className="py-2 px-4 rounded-sm border-2 border-red-400 hover:bg-red-400 hover:text-white" to={`/posts/${post.posts[0].slug}`}>Read more</Link>
      </div>
    </div>
      ))} 
      </div>
    </div>
    <Footer/>
    </>
    )
}

export default PostByCategory