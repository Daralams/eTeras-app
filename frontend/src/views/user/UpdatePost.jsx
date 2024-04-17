import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import {Link, useParams} from "react-router-dom"
// components 
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaSave } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import JoditEditor from "jodit-react"
import slugger from 'slug-pixy'

const UpdatePost = () => {
  const editor = useRef(null)
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [userId, setUserId] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [msg, setMsg] = useState("")
  const {id} = useParams()
  
  useEffect(() => {
    getCategories()
    getPostById()
  }, [])
  
  const getCategories = async() => {
    try {
      const response = await axios.get('http://localhost:3000/category')
      setCategories(response.data[1].data)
    }catch (error) {
      console.error(error.message)
    }
  }
  
  const getPostById = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/post/${id}`)
      setUserId(response.data[0].userId)
      setCategoryId(response.data[0].categoryId)
      setTitle(response.data[0].title)
      setSlug(response.data[0].slug)
      setContent(response.data[0].content)
    }catch(error) {
      console.error(error.message)
    }
  }
  
  const handleTitle = (e) => {
    setTitle(e.target.value)
    setSlug(slugger(e.target.value))
  }
  const handleContent = (value) => {
    setContent(value)
    console.log(value)
  }
  
  const updatePost = async(e) => {
    e.preventDefault()
    try {
      const request = await axios.patch(`http://localhost:3000/posts/edit/${id}`, {
        categoryId,
        userId,
        title,
        slug,
        content
      })
      alert(request.data[0].msg)
    }catch(error) {
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
        <form onSubmit={updatePost}>
        <p className="mb-3 text-center font-bold text-lg">Edit post</p>
        <p className="py-2 font-bold text-red-500 text-center">{msg}</p>
        <input type="hidden" value={userId}/>
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

export default UpdatePost