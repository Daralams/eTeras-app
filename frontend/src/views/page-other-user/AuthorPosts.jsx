// This section use for display author posts selected
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import CardPosts from '../../components/CardPosts'

const AuthorPosts = ({ id }) => {
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState("")
  useEffect(() => {
    getPostsByUserId()
  }, [])
  
  const getPostsByUserId = async () => {
    try {
      // request new accesstoken
      const getToken = await axios.get('http://localhost:3000/token')
      const decoded = jwtDecode(getToken.data[1].RefreshToken)
      setUserId(decoded.userId)
      
      // request page using accessToken
      const request = await axios.get(`http://localhost:3000/post/userId/${id}`, { headers: { Authorization: `Bearer ${getToken.data[0].accessToken}`} 
      })
      setPosts(request.data.data)
    }catch(error) {
      if(error.response.status == 401) {
        navigate('/login')
      }
    }
  }
  
  const popularPosts = async() => {
    try {
      const request = await axios.get(`http://localhost:3000/post/userId/${id}/mostLike`)
      setPosts(request.data.posts)
      console.log(request.data.posts)
    }catch {
      console.log(error.message)
    }
  }
  
  const handleSelectChange = (e) => {
    const optionSelected = e.target.value
    if(optionSelected == 'popular') {
      popularPosts()
    }else {
      getPostsByUserId()
    }
  }
  
  return (
    <div className="pt-6">
      <div className="border-t-2 border-slate-300 p-2 flex justify-end">
      <select className="bg-transparent border-0" onChange={handleSelectChange}>
        <option value="terbaru">Terbaru</option>
        <option value="popular">Popular</option>
      </select>
      </div>
      <CardPosts userId={userId} posts={posts}/>
    </div>
    )
}

export default AuthorPosts