import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Middleware
import { auth } from "../../middleware/auth.js";
// components
import SecondNavbar from "../../components/SecondNavbar";
import Loading from "../../components/Loading.jsx";
import Footer from "../../components/Footer.jsx";

const CommentsHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usernameIsLoggin, setUsernameIsLoggin] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentTotal, setCommentTotal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    commentsHistory();
  }, []);

  const commentsHistory = async () => {
    try {
      const getToken = await auth();
      if (!getToken) {
        navigate("/login");
      }
      const userId = getToken.userId;
      setUsernameIsLoggin(getToken.usernameIsLoggin);
      const response = await axios.get(
        `http://localhost:3000/profile/${userId}/comments-history`,
        {
          headers: { Authorization: `Bearer ${getToken.accessToken}` },
        }
      );
      console.log(response.data.posts);
      setPosts(response.data.posts);
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
          <SecondNavbar title="Comments" />
          <div className="flex flex-col min-h-screen">
            <div className="m-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="h-auto md:col-span-1 p-4">
                  <p className="flex items-center gap-4 text-3xl font-bold font-mono mb-3">
                    {usernameIsLoggin}
                  </p>
                  <p className="text-2xl font-bold font-mono mb-2">
                    Your Comments
                  </p>
                  <p className="text-md font-semibold font-mono">
                    {commentTotal} Comments on {posts.length}
                    {posts.length < 2 ? " Post" : " Posts"}
                  </p>
                </div>

                <div className="col-span-1">
                  {/* post */}
                  {posts.map((post) => (
                    <div className="p-2" key={post.id}>
                      <Link to={`/posts/${post.slug}`} className="p-2">
                        <div className="flex gap-2">
                          {post.user.profile_photo_url ? (
                            <img
                              src={post.user.profile_photo_url}
                              className="flex justify-center items-center w-[50px] h-[45px] rounded-full"
                            />
                          ) : (
                            <div className="flex justify-center items-center bg-indigo-500 w-[50px] h-[45px] text-white rounded-full">
                              {post.user.username[0]}
                            </div>
                          )}

                          {/* posts title */}
                          <div className="p-1.5 w-full">
                            <p className="text-lg">
                              <span className="font-bold font-mono">
                                {post.user.username}
                              </span>{" "}
                              ~ {post.title}
                            </p>
                            <p className="font-light text-[12px] text-slate-800 mb-4">
                              {moment(post.createdAt).startOf("day").fromNow()}
                            </p>

                            {post.comments.map((comment) => (
                              <>
                                <div
                                  className="mb-2 flex gap-2"
                                  key={comment.id}
                                >
                                  {comment.user.profile_photo_url ? (
                                    <img
                                      src={comment.user.profile_photo_url}
                                      className="flex justify-center items-center w-[40px] h-[35px] rounded-full"
                                    />
                                  ) : (
                                    <div className="flex justify-center items-center bg-indigo-500 w-[40px] h-[35px] text-white rounded-full">
                                      {comment.user.username[0]}
                                    </div>
                                  )}
                                  <div className="p-1.5 w-full">
                                    <p>
                                      <span className="font-bold font-mono">
                                        {comment.user.username}
                                      </span>{" "}
                                      ~ {comment.message}
                                    </p>
                                    <p className="font-light text-[12px] text-slate-800 mb-3">
                                      {moment(comment.createdAt)
                                        .startOf("day")
                                        .fromNow()}
                                    </p>
                                  </div>
                                </div>

                                {comment.reply_comments.map((reply) => (
                                  <div className="flex gap-2">
                                    <div className="flex justify-center items-center bg-indigo-500 w-[40px] h-[35px] text-white rounded-full">
                                      {reply.user.username[0]}
                                    </div>
                                    <div className="p-1.5 w-full">
                                      <p>
                                        <span className="font-bold font-mono">
                                          {reply.user.username}
                                        </span>{" "}
                                        <span className="font-light text-blue-500">
                                          @{reply.referenced_username}
                                        </span>{" "}
                                        ~ {reply.message}
                                      </p>
                                      <p className="font-light text-[12px] text-slate-800 mb-3">
                                        {moment(reply.createdAt)
                                          .startOf("day")
                                          .fromNow()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <hr className="w-3/4 font-light text-slate-900" />
                        </div>
                      </Link>
                    </div>
                  ))}
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

export default CommentsHistory;
