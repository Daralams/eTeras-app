import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";
import SecondNavbar from "../../components/SecondNavbar";
import { CiMenuKebab } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import Loading from "../../components/Loading";
import ConfirmPopup from "../../components/popups/ConfirmPopup.jsx";
import PopupSuccess from "../../components/popups/PopupSuccess.jsx";
import AuthFailed from "../../components/popups/AuthFailed.jsx";
import Footer from "../../components/Footer";

const FavoritePosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [usernameIsLoggin, setUsernameIsLoggin] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [successDislikePost, setSuccessDislikePost] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getFavPosts();
  }, [userId]);

  const socket = io("http://localhost:3000");
  const getFavPosts = async () => {
    try {
      const getToken = await auth();
      if (!getToken) {
        navigate("/login");
      }
      setUserId(getToken.userId);
      setUsernameIsLoggin(getToken.usernameIsLoggin);
      const favPostsResponse = await axios.get(
        `http://localhost:3000/profile/${userId}/fav-posts`,
        {
          headers: { Authorization: `Bearer ${getToken.accessToken}` },
        }
      );
      const favPostsData = favPostsResponse.data.data;
      const postsData = favPostsData.map((value) => value.post);
      setPosts(postsData);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPopup = (postId) => {
    if (postId) {
      setSelectedPost(postId);
      setShowConfirmPopup(true);
      setConfirmTitle("Remove favorite post");
      setConfirmMsg(
        "Are you sure you want to remove this post from favorites?  This action will also dislike the post you previously liked."
      );
    }
  };

  const handleRemoveFromFavorite = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/posts/like-dislike",
        {
          userId,
          postId: selectedPost,
        }
      );
      if (response.status == 200) {
        setSuccessDislikePost(true);
        setSuccessPopupTitle("Dislike post success");
        setSuccessPopupMsg("Dislike post successfully!");
        setTimeout(() => {
          socket.emit("like-dislike-process", { postId: selectedPost, userId });
          getFavPosts();
        }, 5000);
      }
    } catch (error) {
      setIsError(true);
      errorMsg(error.response.data.msg);
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const resetSuccessDislike = () => setSuccessDislikePost(false);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SecondNavbar title="Favorite" />
          {showConfirmPopup && (
            <ConfirmPopup
              title={confirmTitle}
              message={confirmMsg}
              onConfirmDelete={handleRemoveFromFavorite}
              onCloseConfirmBox={() => setShowConfirmPopup(false)}
            />
          )}
          {successDislikePost && (
            <PopupSuccess
              state={successDislikePost}
              title={successPopupTitle}
              message={successPopupMsg}
              onClose={resetSuccessDislike}
            />
          )}
          {isError && (
            <div className="fixed top-5 right-5 z-50 text-white rounded-md shadow-lg">
              <AuthFailed error={errorMsg} />
            </div>
          )}
          <div className="flex flex-col min-h-screen">
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
                      Currently you haven't liked any posts, press the ❤ button
                      on the post to like your favorite post.{" "}
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
                              className="text-sm md:text-lg font-bold hover:text-indigo-500"
                            >
                              {post.title}
                            </Link>
                            <br />
                            <small className="text-slate-500">
                              • {moment(post.createdAt).format("MMMM YYYY")}
                            </small>
                          </div>
                          <button
                            className="pt-2 px-2 flex justify-items-start"
                            onClick={() => handleConfirmPopup(post.id)}
                          >
                            <IoMdHeart className="text-red-500 text-2xl" />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default FavoritePosts;
