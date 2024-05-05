import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
// components 
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import moment from 'moment'

const Profile = () => {
  const [refreshToken, setRefreshToken] = useState("")
  const [title, setTitle] = useState("")
  const [userName, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [registerAt, setRegisterAt] = useState("")
  const navigate = useNavigate()
  
  useEffect(() => {
    getUserData()
  }, [])
  
  const getUserData = async() => {
    try {
      const getToken = await axios.get('http://localhost:3000/token')
      
      const refreshToken = getToken.data[1].RefreshToken
      const decoded = jwtDecode(refreshToken)
      setUsername(decoded.userName)
      setEmail(decoded.userEmail)
      setRegisterAt(decoded.registerAt)
      
      const response = await axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${getToken.data[0].accessToken}`
        }
      })
      console.log(response)
      setRefreshToken(getToken.data[0].accessToken)
      setTitle(response.data.msg)
    }catch (error) {
      if(error.response) {
        navigate('/login')
      }
    }
  }
  return (
    <>
    <Navbar/>
    <div className="py-8 px-4 m-0 mx-auto">
      <div className="flex justify-center">
       <div className="w-4/5 md:w-3/5">
       <div className="mx-auto bg-indigo-400 flex justify-center items-center w-[100px] h-[100px] text-white font-bold font-mono text-3xl rounded-full border-2 border-slate-500">{userName[0]}</div>
         <h2 className="font-bold text-xl text-center mt-8 mb-4">{title}</h2>
         <label for="username" className="text-lg">Username : </label>
         <p className="bg-slate-100 p-2 rounded-sm mb-4">{userName}</p>
         <label for="email" className="text-lg">Email : </label>
         <p className="bg-slate-100 p-2 rounded-sm mb-4">{email}</p>
         <label for="email" className="text-lg">Joined at : </label>
         <p className="bg-slate-100 p-2 rounded-sm">{moment(registerAt).format('MMMM YYYY')}</p>
         {/* Masih belum pasti mw taro button logout disini apa gak, sementara btn buat lihat activitas dlu! */}
         <Link to="/profile/activity" className="mt-6 bg-indigo-500 text-white font-bold w-full py-2 rounded-md hover:bg-indigo-300">Activity</Link>
       </div>
      </div>
    </div>
    <Footer/>
    </>
    )
}

export default Profile