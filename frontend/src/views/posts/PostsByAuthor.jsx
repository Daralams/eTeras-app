import axios from 'axios'
// import ImgCard from '../../assets/banner3.jpg'
import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
// components 
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function PostsByAuthor () {
  const [posts, setPosts] = useState([])
  const {username} = useParams()
  
  useEffect(() => {
    getPosts()
  }, [])
  
  const getPosts = async () => {
    const response = await axios(`http://localhost:3000/author/${username}`)
    setPosts(response.data[1].data[0].posts)
    // console.log(response.data[1].data[0].posts)
  }
  
  
  return (
    <>
    <Navbar/>
    <div className="p-3">
      <h1>Posts by : {username}</h1>
      <div className="flex flex-wrap gap-2 justify-center mt-3">
      {posts.map(post => (
      <div className="border-2 border-slate-300 rounded-md shadow-sm p-3 " key={post.id}>
       <p>{post.title}</p>
       <p>{post.createdAt}</p>
       <Link className="text-blue-400" to={`/posts/${post.slug}`}>Read more</Link>
      </div>
      ))}
      </div>
    </div>
    <Footer/>
    </>
    )
}

export default PostsByAuthor