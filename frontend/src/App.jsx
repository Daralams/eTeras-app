import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState } from 'react'
// auth
import Login from './auth/Login'
import Register from './auth/Register'
// views
import LandingPage from './views/landing-page/LandingPage'
// landing page user search result
import LandingUserSearchResult from './views/page-other-user/LandingUserSearchResult'
// user
import Profile from './views/user/Profile'
import Dashboard from './views/user/Dashboard'
import CreatePost from './views/user/CreatePost'
import UpdatePost from './views/user/UpdatePost'
// post
import Posts from './views/posts/Posts'
import DetailPost from './views/posts/DetailPost'
import PostByCategory from './views/posts/PostByCategory'
import PostsByAuthor from './views/posts/PostsByAuthor'

const App = () => {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/create-post" element={<CreatePost/>}/>
      <Route path="/edit-post/:id" element={<UpdatePost/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/posts" element={<Posts/>}/>
      <Route path={`/posts/:slug`} element={<DetailPost/>}/>
      <Route path={`/category/:slug`} element={<PostByCategory/>}/>
      <Route path={`/author/:username`} element={<PostsByAuthor/>}></Route>
      {/* result search user */}
      <Route path={`/search/author/:id/:username`} element={<LandingUserSearchResult/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App