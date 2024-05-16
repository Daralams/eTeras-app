import axios from 'axios'
import React, {useState, useEffect} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import ThemeModeBtn from './ThemeModeBtn'
import SearchInput from './SearchInput'
//icons 
import { HiMenuAlt1 } from "react-icons/hi"
import { CgClose } from "react-icons/cg"
import { BiSolidBookContent } from "react-icons/bi"
import { SiGooglemessages } from "react-icons/si"
import { CiLogin } from "react-icons/ci"
import { CiLogout } from "react-icons/ci"
import { IoHome } from "react-icons/io5"
import { BiSearchAlt } from "react-icons/bi"

function Navbar () {
  const [isLoggin, setIsLoggin] = useState(true)
  const [refreshToken, setRefreshToken] = useState("")
  const [open, setOpen] = useState({ transform: 'translateX(-100%)'})
  const [searchBtnClick, setSearchBtnClick] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    auth()
  }, [])
  
  const auth = async() => {
    try {
      const refreshToken = await axios.get('http://localhost:3000/token')
    }catch (error) {
      if(error.response.status == 401) {
        setIsLoggin(false)
      }
    }
  }
  
  const logout = async() => {
    try {
      // get cookies refreshToken 
      const refreshToken = await axios.get('http://localhost:3000/token')
      // hit logout endpoint
      const response = await axios.delete(`http://localhost:3000/logout`, {
        headers: {
          Cookie: `refreshToken=${refreshToken.data[1].RefreshToken}`
        }
      })
      setIsLoggin(true)
      navigate('/')
    }catch (error) {
      if(error.response) console.error(error.message)
    }
  }
  
  // open & close navbar 
  const handleClick = () => {
    if(open.transform == 'translateX(-100%)') {
      setOpen({open, transform: 'translateX(0%)'})
    }else {
      setOpen({open, transform: 'translateX(-100%)'})
    }
  }
  
  const handleSearchBtn = () => {
    setSearchBtnClick(!searchBtnClick)
  }
  
  return (
    <>
    <div className="p-4 bg-indigo-600">
      <div className="flex gap-3">
      <div className="flex items-center gap-2">
         <button className="text-2xl text-white bg-transparent" onClick={handleClick}><HiMenuAlt1 /></button>
         <div className="bg-indigo-600 block fixed left-0 top-0 bottom-0 w-3/5 leading-[60px] h-screen transition-transform duration-500 ease-in-out z-50" style={open}>
         <div className="flex items-center justify-end">
            <button className="flex items-center justify-end py-4 px-3 text-2xl text-white bg-transparent" onClick={handleClick}><CgClose/></button>
         </div>
          {isLoggin ? 
          (<>
         <NavLink 
          to="/dashboard" 
          className={({isActive}) => `pl-6 w-full text-white flex items-center gap-2  ${isActive ? "hover:bg-indigo-700" : ""}`}><IoHome/> Dashboard</NavLink>
          <NavLink to="/posts" className={({isActive}) => `pl-6 w-full text-white flex items-center gap-2  ${isActive ? "hover:bg-indigo-700" : ""}`}><BiSolidBookContent /> Posts</NavLink>
          <NavLink to="/chats" className={({isActive}) => `pl-6 w-full text-white flex items-center gap-2  ${isActive ? "hover:bg-indigo-700" : ""}`}><SiGooglemessages /> Chats</NavLink>
          <button className="pl-6 w-full bg-transparent text-white flex items-center gap-2 hover:bg-indigo-700" onClick={logout}><CiLogout /> Logout</button>
           </>
          ) : (<NavLink to ="/login" className="pl-6 w-full text-white flex items-center gap-2 hover:hover:bg-indigo-700"><CiLogin /> Login</NavLink>)}
         </div> 
        </div>
      
        <div className="flex justify-between items-center w-full">
          <NavLink to="/" className="text-2xl font-bold font-mono text-white">SiBlogger</NavLink>
          <div className="flex items-center gap-2">
           <button onClick={handleSearchBtn}><BiSearchAlt className="text-3xl text-white" /></button>
            <ThemeModeBtn/>
          </div>
        </div>
        
      </div>
    </div>
    <SearchInput status={searchBtnClick}/>
    </>
    )
}

export default Navbar