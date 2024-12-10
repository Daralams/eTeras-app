import axios from "axios";
import React, { useState, useEffect } from "react";
// middleware
import { auth } from "../../middleware/auth.js";
// components
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer";
import ConfirmPopup from "../../components/popups/ConfirmPopup.jsx";
import PopupSuccess from "../../components/popups/PopupSuccess.jsx";
import AuthFailed from "../../components/popups/AuthFailed.jsx";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { IoShareSocialSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import { SlHeart } from "react-icons/sl";
import { GoComment } from "react-icons/go";
import Loading from "../../components/Loading.jsx";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(0);
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userAbout, setUserAbout] = useState("");
  const [previewImgProfile, setPreviewImgProfile] = useState("");
  const [userDateBirth, setUserDateBirth] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  // confirm state component
  const [postToDelete, setPostToDelete] = useState(null);
  const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [successDeleted, setSuccessDeleted] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [followersTotal, setFollowersTotal] = useState(0);
  const [followingTotal, setFollowingTotal] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dashboardUserIsLoggin();
  }, []);

  // show post by author
  const dashboardUserIsLoggin = async () => {
    try {
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      const userAuthorized = await axios.get(
        `http://localhost:3000/users/${authorization.userId}`,
        {
          headers: { Authorization: `Bearer ${authorization.accessToken}` },
        }
      );

      setUserId(userAuthorized.data.data[0].id);
      setUsername(userAuthorized.data.data[0].username);
      setUserAbout(userAuthorized.data.data[0].about);
      setEmail(userAuthorized.data.data[0].email);
      setPreviewImgProfile(userAuthorized.data.data[0].profile_photo_url);
      setUserDateBirth(
        moment(userAuthorized.data.data[0].date_of_birth).format("YYYY-MM-DD")
      );
      setJoinedDate(
        moment(userAuthorized.data.data[0].createdAt).format("YYYY-MM-DD")
      );

      const userPost = await axios.get(
        `http://localhost:3000/author/${authorization.usernameIsLoggin}`
      );
      setPosts(userPost.data[1].data[0].posts);
      setTotalPosts(userPost.data[1].data[0].posts.length);

      const getFollowers = await axios.get(
        `http://localhost:3000/api/followers/${authorization.userId}`
      );
      const getFollowing = await axios.get(
        `http://localhost:3000/api/following/${authorization.userId}`
      );
      setFollowersTotal(getFollowers.data.followers_total);
      setFollowingTotal(getFollowing.data.following_total);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfirm = (id) => {
    setPostToDelete(id);
    setIsShowConfirmBox(true);
    setConfirmTitle("Delete Post");
    setConfirmMsg(
      "Are you sure you want to delete this Post? This action cannot be undone."
    );
  };

  // delete post
  const deletePost = async () => {
    try {
      if (postToDelete) {
        const deleteRequest = await axios.delete(
          `http://localhost:3000/post/${postToDelete}`
        );
        if (deleteRequest.status == 200) {
          setSuccessDeleted(true);
          setSuccessPopupTitle("Delete post success!");
          setSuccessPopupMsg(
            `Your post with id ${postToDelete} deleted successfully!`
          );
          setTimeout(() => {
            dashboardUserIsLoggin();
          }, 3000);
        }
      }
    } catch (error) {
      setIsError(true);
      setErrorMsg(error.message);
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setPostToDelete(null);
      setIsShowConfirmBox(false);
    }
  };
  const resetSuccessDeleted = () => setSuccessDeleted(false);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <div className="p-4">
              <div className="flex flex-wrap gap-8 justify-center mt-4 border-[1px] rounded-t-md">
                {previewImgProfile ? (
                  <div className="flex justify-center items-center  w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-indigo-600">
                    <img
                      src={previewImgProfile}
                      alt="preview img profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center items-center w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 bg-indigo-500 text-white text-3xl font-bold font-mono rounded-full">
                    {userName[0]}
                  </div>
                )}
                <div className="p-3 w-11/12 md:w-2/5">
                  <p className="text-xl font-bold font-mono md:text-2xl">
                    {userName}
                  </p>
                  {/* dev, jika userAbout == null harusnya isi "" */}
                  {userAbout ? (
                    <p className="text-md font-semibold text-slate-800">
                      {userAbout}
                    </p>
                  ) : (
                    ""
                  )}

                  <div className="flex gap-2 mt-2 mb-3">
                    <p className="font-light">{totalPosts} posts</p>
                    <Link
                      to={`/${userName}/${userId}/followers_following?action=followers`}
                      className="cursor-pointer hover:text-indigo-600"
                    >
                      {followersTotal} Followers
                    </Link>
                    <Link
                      to={`/${userName}/${userId}/followers_following?action=following`}
                      className="cursor-pointer hover:text-indigo-600"
                    >
                      {followingTotal} Following
                    </Link>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      to="/edit-profile"
                      className="flex justify-center items-center font-semibold gap-2 w-full md:w-1/2 py-2 rounded-3xl border-[1.5px] border-slate-500 hover:bg-indigo-500 hover:text-white"
                    >
                      <MdEdit /> Edit profile
                    </Link>
                    <button className="text-2xl">
                      <IoShareSocialSharp />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full p-3 border-t-0 border-[1px]">
                <p className="font-semibold font-mono">Your Profile</p>
              </div>
              <div className="w-full p-3 border-t-0 border-[1px]">
                <ul>
                  <li className="flex items-center gap-2 text-[15px] font-semibold">
                    <MdEmail className="text-lg" /> {email}
                  </li>
                  <li className="mt-2 flex items-center gap-2 text-[15px] font-semibold">
                    <MdOutlineDateRange className="text-lg" /> Joined at{" "}
                    {moment(joinedDate).format("MMMM YYYY")}
                  </li>
                  <li className="mt-2 text-[15px] font-semibold">
                    <Link
                      to="/dashboard/favorite-posts"
                      className="flex items-center gap-2"
                    >
                      <SlHeart className="text-lg" /> Favorite
                    </Link>
                  </li>
                  <li className="mt-2 text-[15px] font-semibold">
                    <Link
                      to="/dashboard/comments-history"
                      className="flex items-center gap-2"
                    >
                      <GoComment className="text-lg" /> Comments
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="w-full p-3 border-t-0 border-[1px] flex items-center justify-between">
                <p className="font-semibold font-mono">
                  Your Posts: {totalPosts}
                </p>
                <Link
                  to="/create-post"
                  className="flex justify-center items-center p-2 text-white bg-indigo-500 rounded-full"
                >
                  <FaPlus />
                </Link>
              </div>

              {/* Confirm Popup */}
              {isShowConfirmBox && (
                <ConfirmPopup
                  title={confirmTitle}
                  message={confirmMsg}
                  onConfirmDelete={deletePost}
                  onCloseConfirmBox={() => setIsShowConfirmBox(false)}
                />
              )}
              {/* Success deleted popup */}
              {successDeleted && (
                <PopupSuccess
                  state={successDeleted}
                  title={successPopupTitle}
                  message={successPopupMsg}
                  onClose={resetSuccessDeleted}
                />
              )}
              {isError && (
                <div className="fixed top-5 right-5 z-50 text-white rounded-md shadow-lg">
                  <AuthFailed error={errorMsg} />
                </div>
              )}
              <div className="w-full border-t-0 border-[1px] rounded-b-md p-3">
                {totalPosts < 1 ? (
                  <p className="font-mono font-bold text-center">
                    You don't have a post yet!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {posts.map((post) => (
                      // show confirm here
                      <div
                        className="w-[300px] p-3 white border-[1px] rounded hover:shadow-md"
                        key={post.id}
                      >
                        <div className="flex">
                          <div className="flex items-center overflow-hidden w-1/3 h-auto">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="rounded"
                            />
                          </div>
                          <div className="pl-3 pt-2 w-2/3 h-[100px]">
                            <Link
                              to={`/posts/${post.slug}`}
                              className="mb-3 text-md font-bold"
                            >
                              {post.title}
                            </Link>
                            <p className="mb-3 text-sm">
                              -{" "}
                              {moment(post.createdAt).format("MMMM dddd YYYY")}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/edit-post/${post.id}`}
                            className="text-lg text-slate-500"
                          >
                            <FaRegEdit />
                          </Link>
                          <button
                            onClick={() => deleteConfirm(post.id)}
                            className="text-xl text-slate-500"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Dashboard;
