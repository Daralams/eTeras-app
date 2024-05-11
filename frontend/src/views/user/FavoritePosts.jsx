import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import SecondNavbar from '../../components/SecondNavbar'
import CardPosts from '../../components/CardPosts'
import { CiMenuKebab } from "react-icons/ci"

const FavoritePosts = () => {
  const [userId, setUserId] = useState(null)
  const [usernameIsLoggin, setUsernameIsLoggin] = useState("")  
  const [posts, setPosts] = useState([])
  const [token, setToken] = useState("")
  const [showRemovePopup, setShowRemovePopup] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    refreshToken()
  }, [userId])
  
  const refreshToken = async() => {
    try {
      const getToken = await axios.get("http://localhost:3000/token")
      const refresh_token = getToken.data[1].RefreshToken
      const decodeToken = jwtDecode(refresh_token)
      setUserId(decodeToken.userId)
      setUsernameIsLoggin(decodeToken.userName)
      setToken(getToken.data[0].accessToken)
      const favPostsResponse = await axios.get(`http://localhost:3000/profile/${userId}/fav-posts`)
      const favPostsData = favPostsResponse.data.data
      const postsData = favPostsData.map(value => value.post)
      setPosts(postsData)
      console.log(postsData)
    }catch(error) {
      console.log(error)
      if(error.response.status == 401) {
        navigate('/login')
      }
    }
  }
  
  const handleRemoveFromFavorite = async (postId) => {
    const response = await axios.post("http://localhost:3000/posts/like-dislike", {
      userId,
      postId
    })
    refreshToken()
  }
  
  return (
    <>
     <SecondNavbar/>
     <div className="m-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="h-auto md:col-span-1 p-4">
        <p className="flex items-center gap-4 text-3xl font-bold font-mono mb-3">{usernameIsLoggin}</p>
        <p className="text-2xl font-bold font-mono mb-2">Favorite Post</p>
        <p className="text-md font-semibold font-mono">{posts.length} {posts.length < 2 ? " Post" : "Posts"}</p>
      </div>
      
     <div className="col-span-1">
     {posts.length < 1 ? 
     <div className="flex justify-center items-center p-4 border-[1px] text-lg text-slate-400">Currently you haven't liked any posts, press the ❤ button on the post to like your favorite post. </div> :
     <>
     {posts.map(post => (
     <div className="p-1.5 flex items-center gap-2 border-[1px] mb-1 rounded-md" key={post.id}>
        <div className="w-1/3 h-[80px] bg-slate-200 rounded-md"></div>
        <div className="w-4/5 p-2">
         <p className="text-[12px]">By <Link to={`/search/author/${post.user.id}/${post.user.username}`} className="text-indigo-500 font-mono">{post.user.username}</Link> in {post.category.name}</p>
         <Link to={`/posts/${post.slug}`} className="font-bold hover:text-indigo-500">{post.title}</Link>
         <br/>
         <small className="text-slate-500">• {moment(post.createdAt).format("MMMM YYYY")}</small>
        </div>
         <button className="pt-2 flex justify-items-start" onClick={() => {
           setSelectedPost(post.id);
           setShowRemovePopup(true);
         }}><CiMenuKebab/></button>
      </div>
     ))}
     </>
     }
      </div>
     </div>
     </div>
     
     {showRemovePopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to remove this post from favorites?</p>
            <div className="flex justify-end mt-4">
              <button className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => {
                handleRemoveFromFavorite(selectedPost);
                setShowRemovePopup(false);
              }}>Remove</button>
              <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setShowRemovePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
    )
}

export default FavoritePosts