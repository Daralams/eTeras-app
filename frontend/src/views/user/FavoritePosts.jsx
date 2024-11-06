import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";
import SecondNavbar from "../../components/SecondNavbar";
// import CardPosts from '../../components/CardPosts'
import { CiMenuKebab } from "react-icons/ci";

const FavoritePosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [usernameIsLoggin, setUsernameIsLoggin] = useState("");
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState("");
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFavPosts();
  }, [userId]);

  const socket = io("http://localhost:3000");
  const getFavPosts = async () => {
    try {
      const getToken = await auth();
      setUserId(getToken.userId);
      setUsernameIsLoggin(getToken.usernameIsLoggin);
      const favPostsResponse = await axios.get(
        `http://localhost:3000/profile/${userId}/fav-posts`
      );
      const favPostsData = favPostsResponse.data.data;
      const postsData = favPostsData.map((value) => value.post);
      setPosts(postsData);
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorite = async (postId) => {
    const response = await axios.post(
      "http://localhost:3000/posts/like-dislike",
      {
        userId,
        postId,
      }
    );
    socket.emit("like-dislike-process", { postId, userId });
    getFavPosts();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center font-bold text-xl">
          Loading...
        </div>
      ) : (
        <>
          <SecondNavbar title="Favorite" />
          <div className="m-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="h-auto md:col-span-1 p-4">
                <p className="flex items-center gap-4 text-3xl font-bold font-mono mb-3">
                  {usernameIsLoggin}
                </p>
                <p className="text-2xl font-bold font-mono mb-2">
                  Favorite Post
                </p>
                <p className="text-md font-semibold font-mono">
                  {posts.length} {posts.length < 2 ? " Post" : "Posts"}
                </p>
              </div>

              <div className="col-span-1">
                {posts.length < 1 ? (
                  <div className="flex justify-center items-center p-4 border-[1px] text-lg text-slate-400">
                    Currently you haven't liked any posts, press the ❤ button on
                    the post to like your favorite post.{" "}
                  </div>
                ) : (
                  <>
                    {posts.map((post) => (
                      <div
                        className="p-1.5 flex items-center gap-2 border-[1px] mb-1 rounded-md"
                        key={post.id}
                      >
                        <div className="w-1/3 h-[80px] overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="rounded-md"
                          />
                        </div>
                        <div className="w-4/5 p-2">
                          <p className="text-[12px]">
                            By{" "}
                            <Link
                              to={`/search/author/${post.user.id}/${post.user.username}`}
                              className="text-indigo-500 font-mono"
                            >
                              {post.user.username}
                            </Link>{" "}
                            in {post.category.name}
                          </p>
                          <Link
                            to={`/posts/${post.slug}`}
                            className="font-bold hover:text-indigo-500"
                          >
                            {post.title}
                          </Link>
                          <br />
                          <small className="text-slate-500">
                            • {moment(post.createdAt).format("MMMM YYYY")}
                          </small>
                        </div>
                        <button
                          className="pt-2 flex justify-items-start"
                          onClick={() => {
                            setSelectedPost(post.id);
                            setShowRemovePopup(true);
                          }}
                        >
                          <CiMenuKebab />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {showRemovePopup && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-4 rounded-md">
                <p>Are you sure you want to remove this post from favorites?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => {
                      handleRemoveFromFavorite(selectedPost);
                      setShowRemovePopup(false);
                    }}
                  >
                    Remove
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setShowRemovePopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FavoritePosts;
