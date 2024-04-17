import  React, {useState, useRef, useEffect} from 'react'
import axios from "axios"
import {jwtDecode} from 'jwt-decode'
import {Link} from "react-router-dom"
// components 
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaSave } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import JoditEditor from "jodit-react"
import slugger from 'slug-pixy'

const CreatePost = () => {
  const editor = useRef(null)
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [userId, setUserId] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    getUser()
    getCategory()
  }, [])
  
  const getUser = async() => {
    try {
      const refreshToken = await axios.get('http://localhost:3000/token')
      const token = refreshToken.data[1].RefreshToken
      const decoded = jwtDecode(token)
      setUserId(decoded.userId)
    }catch (error) {
      console.log(error)
    }
  }
  
  const getCategory = async() => {
    try {
      const response = await axios.get('http://localhost:3000/category')
      setCategories(response.data[1].data)
    }catch (error) {
      console.error(error.message)
    }
  }
  
  const handleContent = (value) => {
    setContent(value)
  }

  const handleTitle = (e) => {
    setTitle(e.target.value)
    setSlug(slugger(e.target.value))
  }
  
  const createPost = async(e) => {
    e.preventDefault()
    try {
      const request = await axios.post('http://localhost:3000/posts', 
      {
        categoryId,
        userId,
        title,
        slug,
        content
      })
      alert(request.data[0].msg)
    }catch (error) {
      if(error.response) {
        setMsg(error.response.data.msg)
      }
    }
  }
  
  return (
    <>
    <Navbar/>
    <div className="flex justify-center">
      <div className="mt-5 mb-5 w-4/5 rounded shadow-md p-4 lg:w-3/5">
        <form onSubmit={createPost}>
        <p className="mb-3 text-center text-red-500 font-bold text-md">{msg}</p>
        <input type="hidden" value={userId}
        onChange={(e) => setUserId(e.value.target)}/>
        <input type="text" className="p-2 w-full border-b-2 border-indigo-400 mb-3 block" placeholder="Title post"
        value={title}
        onChange={handleTitle}/>
        <input type="hidden"
        value={slug}
        onChange={handleTitle}/>
        <JoditEditor
        ref={editor}
        value={content}
        onChange={handleContent}
        />

       <select 
       value={categoryId}
       onChange={(e) => setCategoryId(e.target.value)}
       className="bg-white border-[1px] border-black rounded w-full mt-3 p-3" >
        <option value="">Select category</option>
        {categories.map(category => (
          <option 
          value={category.id} 
          key={category.id}>{category.name}</option>
        ))}
        </select> 
        
        
        <div className="flex justify-end gap-2 mt-3">
        {/* !! nanti klo dh kelar bikin func save ini !! <button className="bg-blue-500 px-5 py-2 flex items-center gap-2 text-white rounded-md font-bold">Save <FaSave/></button> */}
         <button className="bg-indigo-500 px-5 py-2 flex items-center gap-2 text-white rounded-md font-bold">Post <IoSend/></button>
        </div>
        </form> 
      </div>
    </div>
    <Footer/>
    </>
    )
  }

export default CreatePost