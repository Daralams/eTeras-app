import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SearchInput = ({ status }) => {
  const [activeForm, setActiveForm] = useState("searchPostsForm")
  const [searchPostKey, setSearchPostKey] = useState("")
  const [searchAuthorName, setSearchAuthorName] = useState("")
  const [searchPostResult, setSearchPostResult] = useState([])
  const [searchAuthorResult, setSearchAuthorResult] = useState([])
  const [msg, setMsg] = useState(null)
  
  useEffect(() => {
    getSearchResultByKey()
  }, [searchPostKey, searchAuthorName])
  
  const getSearchResultByKey = async () => {
    try {
      if(activeForm == "searchPostsForm") {
        const requestPosts = await axios.get(`http://localhost:3000/search/posts?key=${searchPostKey}`)
        console.log(requestPosts.data.data.rows)
        setSearchPostResult(requestPosts.data.data.rows)
      }else {
        const requestAuthor = await axios.get(`http://localhost:3000/search/author?name=${searchAuthorName}`)
        setSearchAuthorResult(requestAuthor.data.data.rows)
      }
    }catch (error) {
      if(error.response.status == 404) {
        setMsg(error.response.status)
      }else {
        setMsg(null)
      }
    }
  }
  // for switch form 
  const selectSearchPostForm = () => {
    setActiveForm("searchPostsForm")
  }
  
  const selectSearchAuthorForm = () => {
    setActiveForm("searchAuthorForm")
  }
  
  return (
    <div className={`${status == true ? 'block' : 'hidden'} absolute z-20 right-2 left-2 top-20 bg-white p-3 border-[1px] rounded-md shadow-lg`}>
    <div className="flex justify-between w-full mb-3">
      <button onClick={selectSearchAuthorForm} className={`border-[1px] w-1/2 ${activeForm == 'searchAuthorForm' ? 'border-b-2 border-b-indigo-400' : ''}`}>Author</button>
      <button onClick={selectSearchPostForm} className={`border-[1px] border-l-0 w-1/2 ${activeForm == 'searchPostsForm' ? 'border-b-2 border-b-indigo-400' : '' }`}>Posts</button>
    </div>
    {activeForm == "searchPostsForm" ? 
    (
    <>
    <div className="flex justify-center">
     <input type="text" className="w-full md:w-1/2 p-3 border-2 rounded-3xl" placeholder="Search posts..."
     value={searchPostKey}
     onChange={(e) => setSearchPostKey(e.target.value)}/>
    </div>
    {msg && msg === 404 && (
      <p className="mt-4 mx-2 font-mono font-bold">{searchPostKey} : Not found</p>)}
    {(!msg || (msg && msg !== 404)) && ( 
     <ul className="mt-4 mx-2"> 
    {(!searchPostKey ? "" : searchPostResult.map(post => ( 
      <Link to={`/posts/${post.slug}`} key={post.id}>
        <li className="w-full p-2 rounded hover:bg-indigo-400 hover:text-white">{post.title}</li>
      </Link>
     )))}
    </ul>
    )}
    </>
    ) : (
    <>
    <div className="flex justify-center">
     <input type="text" className="w-full md:w-1/2 p-3 border-2 rounded-3xl" placeholder="Search author..."
     value={searchAuthorName}
     onChange={(e) => setSearchAuthorName(e.target.value)}/>
    </div>
    {msg && msg === 404 && (
      <p className="mt-4 mx-2 font-mono font-bold">Author: {searchAuthorName} Not found</p>)}
    {(!msg || (msg && msg !== 404)) && ( 
     <ul className="mt-4 mx-2"> 
    {(!searchAuthorName ? "" : searchAuthorResult.map(author => ( 
      <Link to={`/search/author/${author.id}/${author.username}`} key={author.id}>
        <li className="flex items-center gap-4 font-bold font-mono w-full p-2 rounded hover:bg-indigo-400 hover:text-white"><span className="flex justify-center items-center bg-indigo-400 text-white font-bold font-mono w-[45px] h-[45px] rounded-full border-2 border-fuchsia-400">{author.username[0]}</span>{author.username}</li>
      </Link>
     )))}
    </ul>
    )}
    </>
      )
    }

    </div>
    )
}

export default SearchInput