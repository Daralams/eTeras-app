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
  const [error, setError] = useState(false)
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
      if(response.data.status == 'failed') {
        setMsg(response.data.msg)
        setError(true)
        return 
      }
      setPosts(response.data.data)
    }catch (error) {
      console.log(error.message)
    }
  }
  
  return (
    <>
    <Navbar/>
    <CardPosts userId={userId} posts={posts} socket={socket}/>
    {error ? 
    <div className="flex justify-center items-center w-full h-screen text-3xl font-extrabold font-mono">{msg}!</div> : ""}
    <Footer/>
    </>
    )
}

export default Posts