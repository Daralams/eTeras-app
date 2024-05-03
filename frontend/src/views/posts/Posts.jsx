import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
// components
import Navbar from '../../components/Navbar'
import CardPosts from '../../components/CardPosts'
import Footer from '../../components/Footer'

const Posts = () => {
  const [token, setToken] = useState("")
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState("")
  const [msg, setMsg] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    getPostsData()
  }, [])
  
  const getPostsData = async() => {
    try {
      // request new accesstoken
      const getToken = await axios.get('http://localhost:3000/token')
      const decoded = jwtDecode(getToken.data[1].RefreshToken)
      setUserId(decoded.userId)
      
      // request page using accessToken
      const response = await axios.get("http://localhost:3000/posts"
      ,{ headers: { Authorization: `Bearer ${getToken.data[0].accessToken}`} 
      })
      setToken(getToken.data.accessToken)
      setPosts(response.data[1].data)
      console.log(response.data[1].data)
    }catch (error) {
      if(error.response.status == 401) {
        navigate('/login')
      }else if(error.response.status == 404) {
        setMsg(error.response.data.error)
        setError(404)
      }
    }
  }
  
  return (
    <>
    <Navbar/>
    <CardPosts userId={userId} posts={posts}/>
    {error == 404 ? 
    <div className="flex justify-center items-center w-full h-screen text-3xl font-extrabold font-mono">{msg}!</div> : ""}
    <Footer/>
    </>
    )
}

export default Posts