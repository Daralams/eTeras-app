import {BrowserRouter, Routes, Route} from 'react-router-dom'
// auth
import Login from '../auth/Login'
import Register from '../auth/Register'
// views
import LandingPage from '../views/landing-page/LandingPage'
// landing page user search result
import LandingUserSearchResult from '../views/page-other-user/LandingUserSearchResult'
// user
import Dashboard from '../views/user/Dashboard'
import FavoritePosts from '../views/user/FavoritePosts'
import UserComments from '../views/user/UserComments'
import CreatePost from '../views/user/CreatePost'
import UpdatePost from '../views/user/UpdatePost'
// post
import Posts from '../views/posts/Posts'
import DetailPost from '../views/posts/DetailPost'
import PostByCategory from '../views/posts/PostByCategory'
import PostsByAuthor from '../views/posts/PostsByAuthor'

const Router = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/dashboard/favorite-posts" element={<FavoritePosts/>}/>
      <Route path="/dashboard/your-comments" element={<UserComments/>}/>
      <Route path="/create-post" element={<CreatePost/>}/>
      <Route path="/edit-post/:id" element={<UpdatePost/>}/>
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

export default Router