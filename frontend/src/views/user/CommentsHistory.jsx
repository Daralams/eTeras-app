import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import React, { useState, useEffect } from "react" 
import { Link, useNavigate } from 'react-router-dom'
import SecondNavbar from '../../components/SecondNavbar'

const CommentsHistory = ({ access_token, refresh_token, authorized }) => {
  const [userId, setUserId] = useState(null)
  const [usernameIsLoggin, setUsernameIsLoggin] = useState("")
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()
  
  if(authorized == 401) {
    navigate("/login")
  }
  
  useEffect(() => {
    commentsHistory()
  }, [userId], [])
  
  const commentsHistory = async() => {
    try {
      const decodeToken = jwtDecode(refresh_token)
      console.log(decodeToken)
      setUserId(decodeToken.userId)
      setUsernameIsLoggin(decodeToken.userName)
      console.log("User id: " + userId)
      const response = await axios.get(`http://localhost:3000/profile/${userId}/comments-history`)
      setPosts(response.data.posts)
      console.log(response.data.posts)
    }catch(error) {
      console.log(error.message)
    }
  }
  
  return (
    <>
      <SecondNavbar/>
      <div className="m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="h-auto md:col-span-1 p-4">
            <p className="flex items-center gap-4 text-3xl font-bold font-mono mb-3">{usernameIsLoggin}</p>
            <p className="text-2xl font-bold font-mono mb-2">Your Comments</p>
            <p className="text-md font-semibold font-mono">{posts.length} {posts.length < 2 ? 'Comment' : 'Comments'}</p>
          </div>
          
        <div className="col-span-1">
          {/* post */}
          {posts.map(post => (
          <div className="p-2" key={post.id}>
            <Link to={`/posts/${post.slug}`} className="p-2">
              <div className="flex gap-2">
                <div className="flex justify-center items-center bg-indigo-500 w-[50px] h-[45px] text-white rounded-full">{post.user.username[0]}</div>
                {/* posts title */}
                <div className="p-1.5 w-full">
                    <p className="text-lg"><span className="font-bold font-mono">{post.user.username}</span> ~ {post.title}</p>
                    <p className="font-light text-[12px] text-slate-800 mb-4">{moment(post.createdAt).startOf('day').fromNow()}</p>
                    
                    {post.comments.map(comment => (
                    <>
                    <div className="mb-2 flex gap-2" key={comment.id}>
                      <div className="flex justify-center items-center bg-indigo-500 w-[40px] h-[35px] text-white rounded-full">{comment.user.username[0]}</div>
                      <div className="p-1.5 w-full">
                        <p><span className="font-bold font-mono">{comment.user.username}</span> ~ {comment.message}</p>
                        <p className="font-light text-[12px] text-slate-800 mb-3">{moment(comment.createdAt).startOf('day').fromNow()}</p>
                        </div>
                    </div>
                    
                    {comment.reply_comments.map(reply => (
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center bg-indigo-500 w-[40px] h-[35px] text-white rounded-full">{reply.user.username[0]}</div>
                      <div className="p-1.5 w-full">
                        <p><span className="font-bold font-mono">{reply.user.username}</span> <span className="font-light text-blue-500">@{reply.referenced_username}</span> ~ {reply.message}</p>
                        <p className="font-light text-[12px] text-slate-800 mb-3">{moment(reply.createdAt).startOf('day').fromNow()}</p>
                        </div>
                    </div>
                    ))}
                    </>
                    ))}
                    
                    
                </div>
              </div>
              <div className="flex justify-center"><hr className="w-3/4 font-light text-slate-900"/></div>
            </Link>
          </div>
          ))}
        </div>
       </div>
     </div>
    </>
    )
}

export default CommentsHistory