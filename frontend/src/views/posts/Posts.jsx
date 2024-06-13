import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
// middleware 
import { auth } from '../../middleware/auth.js'
// components
import Navbar from '../../components/Navbar'
import io from 'socket.io-client'
import CardPosts from '../../components/CardPosts'
import Footer from '../../components/Footer'

const socket = io('http://localhost:3000')
const Posts = () => {
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
      const getToken = await auth()
      setUserId(getToken.userId)
      // request page using accessToken
      const response = await axios.get("http://localhost:3000/posts"
      ,{ headers: { Authorization: `Bearer ${getToken.accessToken}`}
      })
      setPosts(response.data[1].data)
    }catch (error) {
      if(error.response.status == 401 || 403) {
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
    <CardPosts userId={userId} posts={posts} socket={socket}/>
    {error == 404 ? 
    <div className="flex justify-center items-center w-full h-screen text-3xl font-extrabold font-mono">{msg}!</div> : ""}
    <Footer/>
    </>
    )
}

export default Posts