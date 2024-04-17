import React, {useState, useEffect} from "react"
import {useParams, Link, useNavigate} from "react-router-dom"
import axios from "axios"
import moment from "moment"
// components
import Navbar from '../../components/Navbar'
import Comments from "../../components/Comments"
import Footer from '../../components/Footer'

const DetailPost = () => {
  const [token, setToken] = useState("")
  const [postDetail, setPostDetail] = useState([])
  const {slug} = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    getPostBySlug()
  }, [])
  
  const getPostBySlug = async () => {
    try {
      const getToken = await axios.get('http://localhost:3000/token')
      const response = await axios(`http://localhost:3000/posts/${slug}`, {
        headers: { Authorization: `Bearer ${getToken.data[0].accessToken}`} 
      })
      setToken(getToken.data.accessToken)
      setPostDetail(response.data)
    }catch (error) {
      if(error.response) {
        navigate('/login')
      }
    }
  }

  return (
    <>
    <Navbar/>
    <div className="h-auto mb-20">
    {postDetail.map(post => (
    <div className="p-4" key={post.id}>
      <p className="text-sm">By- <Link to={`/author/${post.user.username}`} className="text-blue-300">{post.user.username} </Link> in {post.category.name}</p>
      <p className="mb-4 text-sm text-slate">Publish at - {moment(post.createdAt).format("MMMM dddd YYYY")}</p>
     <div dangerouslySetInnerHTML={{ __html: post.content}}/>
    </div>
    ))}
    </div>
    <Comments/>
    <Footer/>
    </>
    )
}

export default DetailPost