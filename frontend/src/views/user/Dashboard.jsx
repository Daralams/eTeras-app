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
import { MdEdit } from "react-icons/md"
import { MdDeleteForever } from "react-icons/md"
import { IoShareSocialSharp } from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import { MdOutlineDateRange } from "react-icons/md"
import { SlHeart } from "react-icons/sl"
import { GoComment } from "react-icons/go"

const Dashboard = () => { 
  const [userName, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [joinedDate, setJoinedDate] = useState("")
  const [posts, setPosts] = useState([])
  const [totalPosts, setTotalPosts] = useState(null)
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
      setEmail(decode.userEmail)
      setJoinedDate(decode.registerAt)
      const userPost = await axios.get(`http://localhost:3000/author/${decode.userName}`)
      setPosts(userPost.data[1].data[0].posts)
      setTotalPosts(userPost.data[1].data[0].posts.length)
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
      <div className="flex flex-wrap gap-8 justify-center mt-4 border-[1px] rounded-t-md">
       <div className="mt-4 flex justify-center items-center w-[85px] h-[85px] lg:w-[100px] lg:h-[100px] bg-indigo-500 text-white text-3xl font-bold font-mono rounded-full">{userName[0]}</div>
       <div className="p-3 w-11/12 md:w-2/5">
        <p className="text-xl font-bold font-mono md:text-2xl">{userName}</p>
        <p className="text-md font-semibold text-slate-800">Backend developer</p>
        <div className="flex gap-2 mt-2 mb-3">
         <p className="font-light">{totalPosts} posts</p>
         <p className="font-light">2k Followers</p>
         <p className="font-light">1k Following</p>
        </div>
        <div className="flex gap-1">
         <Link to="/edit-profile" className="flex justify-center items-center font-semibold gap-2 w-full md:w-1/2 py-2 rounded-3xl border-[1.5px] border-slate-500 hover:bg-indigo-500 hover:text-white"><MdEdit/>  Edit profile</Link>
          <button className="text-2xl"><IoShareSocialSharp/></button>
        </div>
       </div>
      </div>
      <div className="w-full p-3 border-t-0 border-[1px]">
       <p className="font-semibold font-mono">Your Profile</p>
      </div>
      <div className="w-full p-3 border-t-0 border-[1px]">
       <ul>
        <li className="flex items-center gap-2 text-[15px] font-semibold"><MdEmail className="text-lg"/> {email}</li>
        <li className="mt-2 flex items-center gap-2 text-[15px] font-semibold"><MdOutlineDateRange className="text-lg"/>  Joined at {moment(joinedDate).format("MMMM YYYY")}</li>
        <li className="mt-2 text-[15px] font-semibold">
          <Link to="/dashboard/favorite" className="flex items-center gap-2">
          <SlHeart className="text-lg"/> Favorite</Link>
        </li>
        <li className="mt-2 text-[15px] font-semibold">
          <Link to="/dashboard/comments" className="flex items-center gap-2">
          <GoComment className="text-lg"/> Comments</Link>
        </li>
       </ul>
      </div>
      <div className="w-full p-3 border-t-0 border-[1px] flex items-center justify-between">
       <p className="font-semibold font-mono">Your Posts: {totalPosts}</p>
       <Link to="/create-post" className="flex justify-center items-center p-2 text-white bg-indigo-500 rounded-full"><FaPlus/></Link>
      </div>
      
    <div className="w-full border-t-0 border-[1px] rounded-b-md p-3">
    {totalPosts < 1 ? (<p className="font-mono font-bold text-center">You don't have a post yet!</p>) : (
    <div className="flex flex-wrap gap-2">
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
    )}
    </div>
    </div>
    <Footer/>
    </>
    )
}

export default Dashboard