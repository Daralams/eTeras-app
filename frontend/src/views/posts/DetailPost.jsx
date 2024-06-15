import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import moment from "moment"
// middleware 
import { auth } from '../../middleware/auth.js'
// components
import SecondNavbar from '../../components/SecondNavbar'
import Comments from "../../components/Comments"
import Footer from '../../components/Footer'

const DetailPost = () => {
  const [postDetail, setPostDetail] = useState([])
  const [idPost, setIdPost] = useState(null)
  const {slug} = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    getPostBySlug()
  }, [])
  
  const getPostBySlug = async () => {
    try {
      const getToken = await auth()
      const response = await axios(`http://localhost:3000/posts/${slug}`, {
        headers: { Authorization: `Bearer ${getToken.accessToken}`} 
      })
      setPostDetail(response.data)
      setIdPost(response.data[0].id)
    }catch (error) {
      if(error.response) {
        navigate('/login')
      }
    }
  }

  return (
    <>
    <SecondNavbar/>
    <div className="h-auto mb-20">
    {postDetail.map(post => (
    <div className="p-4" key={post.id}>
      <p className="text-sm">By- <Link to={`/author/${post.user.username}`} className="text-blue-300">{post.user.username} </Link> in {post.category.name}</p>
      <p className="mb-4 text-sm text-slate">Publish at - {moment(post.createdAt).format("MMMM dddd YYYY")}</p>
      <img src={post.imageUrl} alt={post.title}/>
     <div dangerouslySetInnerHTML={{ __html: post.content}}/>
    </div>
    ))}
    </div>
    <Comments idPost={idPost}/>
    <Footer/>
    </>
    )
}

export default DetailPost