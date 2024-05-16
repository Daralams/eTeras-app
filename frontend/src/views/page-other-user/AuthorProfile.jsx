// This section use for display profile author selected 
import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

const AuthorProfile = ({ id }) => {
  const [user, setUser] = useState("")
  const [countPosts, setCountPosts] = useState(null)
  // sementara ngaff
  const [profilPhoto, setProfilPhoto] = useState("")
  
  useEffect(() => {
    getProfile()
  }, [])
  
  const getProfile = async() => {
    const userData = await axios.get(`http://localhost:3000/other-profile-user/${id}`)
    setUser(userData.data.userProfile)
    console.log(userData.data.userProfile)
    setCountPosts(userData.data.userProfile.posts.length)
    // get first index string for profile photo
    const username = userData.data.userProfile.username
    const firstLetter = username.charAt(0)
    setProfilPhoto(firstLetter)
  }
  
  return (
    <div className="mt-6">
     <div className="flex gap-3 justify-center m-2">
       <div className="w-[70px] h-[70px] mt-2 flex justify-center items-center bg-indigo-400 text-white text-xl font-mono font-bold rounded-full border-2 border-fuchsia-400">{profilPhoto}</div>
       <div className="p-2">
         <h1 className="text-2xl font-bold font-mono mb-2">{user.username}</h1>
         <p className="text-lg">Backend developer</p>
         <div className="flex gap-3">
           <p>{countPosts} posts</p>
           <p>25k Followers</p>
           <p>5k Following</p>
         </div>
         <p className="py-2 text-[15px]">Joined at {moment(user.createdAt).format('MMMM YYYY')}</p>
         <div className="mt-3 flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Follow</button>
          <Link to="/chats/id-obrolan" className="px-4 py-2 bg-blue-500 text-white rounded">Messege</Link>
        </div>
       </div>
     </div>
    </div>
    )
}

export default AuthorProfile