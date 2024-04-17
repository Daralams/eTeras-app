import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import React, {useState, useEffect} from 'react'
// components
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import moment from 'moment'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { FaPlus } from "react-icons/fa"
import { FaRegEdit } from "react-icons/fa"
import { MdDeleteForever } from "react-icons/md"

const Dashboard = () => { 
  const [userName, setUsername] = useState("")
  const [posts, setPosts] = useState([])
  const {id} = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    response()
  }, [])
  
  // show post by author 
  const response = async () => {
    try {
      const refreshToken = await axios.get('http://localhost:3000/token')
      const user = refreshToken.data[1].RefreshToken
      const decode = jwtDecode(user)
      setUsername(decode.userName)
      const userPost = await axios.get(`http://localhost:3000/author/${decode.userName}`)
      setPosts(userPost.data[1].data[0].posts)
    }catch(error) {
      if(error.response) {
        navigate("/login")
      }
    }
  }
  
  // delete post
  const deletePost = async(id) => {
    try {
      const deleteConfirm = confirm("You want delete this post?")
      if(deleteConfirm === true) {
        const request = await axios.delete(`http://localhost:3000/post/${id}`)
        alert(request.data.msg)
        response()
        }
      }catch (error) {
         console.error(error.message)
      }
  }
  
  return (
    <>
    <Navbar/>
    <div className="p-4">
      <h1 className="pl-2 text-2xl">Welcome back <span className="font-bold text-indigo-500">{userName} 👋</span></h1>
      <p className="pl-2 pt-3">Your posts : </p>
      <div className="flex flex-wrap gap-2 m-2">
      {posts.map(post => (
      <div className="w-[300px] p-3 white border-[1px] rounded hover:shadow-md" key={post.id}>
        <div className="flex">
          <div className="w-1/3 h-auto bg-slate-100 rounded">
          </div>
          <div className="pl-3 pt-2 w-2/3 h-[100px]">
            <Link to={`/posts/${post.slug}`} className="mb-3 text-md font-bold">{post.title}</Link>
            <p className="mb-3 text-sm">- {moment(post.createdAt).format("MMMM dddd YYYY")}</p>
          </div>
        </div>
            <div className="flex justify-end items-center gap-2">
              <Link to={`/edit-post/${post.id}`} className="text-lg text-slate-500"><FaRegEdit/></Link>
              <button onClick={() => deletePost(post.id)} className="text-xl text-slate-500"><MdDeleteForever/></button>
            </div>
      </div>
      ))}
      </div>
      
      <div className="w-[60px] h-[60px] rounded-full bg-indigo-500 absolute z-10 right-4 bottom-6  flex justify-center items-center">
        <Link to="/create-post" className=" text-2xl text-white"><FaPlus/></Link>
      </div>
    </div>
    <Footer/>
    </>
    )
}

export default Dashboard