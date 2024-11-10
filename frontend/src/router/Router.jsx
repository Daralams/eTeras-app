import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// auth
import Login from "../auth/Login";
import Register from "../auth/Register";
// views
import LandingPage from "../views/landing-page/LandingPage";
// landing page user search result
import LandingUserSearchResult from "../views/page-other-user/LandingUserSearchResult";
// user
import Dashboard from "../views/user/Dashboard";
import AccountSettings from "../views/user/AccountSettings";
import FavoritePosts from "../views/user/FavoritePosts";
import CommentsHistory from "../views/user/CommentsHistory";
import CreatePost from "../views/user/CreatePost";
import UpdatePost from "../views/user/UpdatePost";
// post
import Posts from "../views/posts/Posts";
import DetailPost from "../views/posts/DetailPost";
import PostByCategory from "../views/posts/PostByCategory";
// chats
import MyChats from "../views/realtime-chat/MyChats";
import ChatWindow from "../views/realtime-chat/ChatWindow";
// alert test

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="edit-profile" element={<AccountSettings />} />
          <Route path="/dashboard/favorite-posts" element={<FavoritePosts />} />
          <Route
            path="/dashboard/comments-history"
            element={<CommentsHistory />}
          />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<UpdatePost />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path={`/posts/:slug`} element={<DetailPost />} />
          <Route path={`/category/:slug`} element={<PostByCategory />} />
          {/* result search user */}
          <Route
            path={`/search/author/:id/:username`}
            element={<LandingUserSearchResult />}
          />
          <Route path="/chats" element={<MyChats />} />
          <Route
            path="/chats/content/:userId/:conversation_id"
            element={<ChatWindow />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
