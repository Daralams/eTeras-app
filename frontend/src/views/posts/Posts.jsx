import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";
// components
import Navbar from "../../components/Navbar";
import io from "socket.io-client";
import CardPosts from "../../components/CardPosts";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading.jsx";
import no_post_available from "../../../public/assets/no_post_available.png";

const Posts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPostsData();
    // ini bisa sebenernya, tapi akan berat karna setiap kali like / dislike request posts ulang
    // sementara pakai cara ini dulu
    socket.on("show-recent-like-total", async (posts) => {
      // setPosts(posts);
      getPostsData();
    });
    // dev ~ untuk memperbaiki cara diatas ( belum berhasil )
    // socket.on("show-recent-like-total", (updatedPost) => {
    //   setPosts((prevPosts) =>
    //     prevPosts.map((post) =>
    //       post.id === updatedPost.id
    //         ? { ...post, likes: updatedPost.likes }
    //         : post
    //     )
    //   );
    //   console.log("Updated posts: ", updatedPost);
    // });
    return () => socket.off("show-recent-like-total");
  }, []);

  const socket = io("http://localhost:3000");
  const getPostsData = async () => {
    try {
      // request new accesstoken
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      setUserId(authorization.userId);
      // request page using accessToken
      const response = await axios.get("http://localhost:3000/posts", {
        headers: { Authorization: `Bearer ${authorization.accessToken}` },
      });
      if (response.data.status == "failed") {
        setMsg(response.data.msg);
        setError(true);
        return;
      }
      setPosts(response.data.data);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          {error ? (
            <div className="flex flex-col justify-center items-center p-4 md:p-8 mt-8">
              <div className="mb-6">
                <img
                  src={no_post_available}
                  alt="no post mockup"
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <div className="text-md md:text-xl font-extrabold font-mono text-center text-gray-700 mb-4">
                "Oops! It looks like there are no posts yet. Start sharing by
                creating your first post!"
              </div>
              <Link
                to="/create-post"
                className="bg-indigo-600 text-white font-bold px-4 py-2 hover:bg-indigo-500 rounded"
              >
                Let's create!
              </Link>
            </div>
          ) : (
            ""
          )}
          <CardPosts userId={userId} posts={posts} socket={socket} />
          <Footer />
        </>
      )}
    </>
  );
};

export default Posts;
