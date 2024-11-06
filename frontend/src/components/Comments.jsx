import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { LuSendHorizonal } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";

const Comments = ({ post, userId, userNameIsLoggin, token }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const [userName, setUsername] = useState("");
  const [postId, setPostId] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  //state untuk merubah form comment menjadi reply
  const [isReply, setIsReply] = useState(false);
  const [parentReplyId, setParentReplyId] = useState("");
  const [referenced_username, setReferencedUsername] = useState("");
  const [commentId, setCommentId] = useState("");
  // state untuk mengecek status balas balasan lain.
  const [isReplyToReply, setIsReplyToReply] = useState(false);
  // state open, close drop down
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedReplyCommentId, setSelectedReplyCommentId] = useState(null);
  const [isEditComment, setIsEditComment] = useState(false);
  const [isEditReplyComment, setIsEditReplyComment] = useState(false);
  // show reply state
  const [displayBtnTarget, setDisplayBtnTarget] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    getComments();
    socket.on("recent-comments", async (recentComments) => {
      // console.log("Comments props: ", post);
      // console.log("Recent comments derr: ", newCommentSaved);
      // dev ~ untuk memperbaiki cara dubawah ( belum berhasil )
      // newCommentSaved.map((comment) => {
      //   console.log(comment.user);
      // });
      // setComments((prevComments) => [...prevComments, newCommentSaved]);
      if (post.id === recentComments.postId) {
        const getRecentCommentsByPostId = await axios.get(
          `http://localhost:3000/posts/comments/${recentComments.postId}`
        );
        const recentCommentSaved = getRecentCommentsByPostId.data.data;
        setComments(recentCommentSaved);
      }
      console.log(comments);
    });
    return () => socket.off("recent-comments");
  }, []);

  const socket = io("http://localhost:3000");
  const getComments = async () => {
    try {
      if (userId) {
        setIsLogin(true);
      }
      setPostId(post.id);
      setComments(post.comments);
      console.log(comments);

      const getFullDataUserIsLoggin = await axios.get(
        `http://localhost:3000/users/${userId}`
      );
      setUserProfilePhoto(
        getFullDataUserIsLoggin.data.data[0].profile_photo_url
      );
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (e) => {
    const [id, username] = JSON.parse(e.target.value);
    setCommentId(id);
    setUsername(username);
    setReferencedUsername(username);
    setIsReply(true);
  };
  const cancelReplyMessage = () => {
    setIsReply(false);
  };
  const handleReplies = (e) => {
    const [replyId, commentId, username] = JSON.parse(e.target.value);
    setParentReplyId(replyId);
    setCommentId(commentId);
    setUsername(username);
    setReferencedUsername(username);
    setIsReply(true);
    setIsReplyToReply(true);
  };

  const handleEditBtn = (e) => {
    try {
      const [id, message] = JSON.parse(e.target.value);
      console.log(`id comment: ${id} \nmessage comment: ${message}`);
      setCommentId(id);
      setMessage(message);
      setIsEditComment(true);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  // dev
  const handleEditReplyBtn = (e) => {
    const [id, message] = JSON.parse(e.target.value);
    console.log(
      `id reply comment: ${id} \nreply message comment: ${message} userId: ${userId}`
    );
    setCommentId(id);
    setMessage(message);
    setIsEditReplyComment(true);
    console.log({ isEditReplyComment });
  };

  const postComment = async (e) => {
    e.preventDefault();
    try {
      if (!isEditComment) {
        const sendComment = await axios.post(
          `http://localhost:3000/posts/comments/${postId}`,
          {
            postId,
            userId,
            message,
          }
        );
        const commentMsg = { postId, userId, message };
        setMessage("");
        socket.emit("comment-proccess", commentMsg);
      } else {
        // edit comment
        const saveCommentEditted = await axios.patch(
          `http://localhost:3000/posts/comments/${commentId}`,
          {
            userId,
            message,
          }
        );
        if (saveCommentEditted.status == 200) {
          alert("Comment editted successfully!");
          setMessage("");
          setIsEditComment(false);
          socket.emit("comment-proccess", { postId: post.id });
        }
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const deleteComment = async (id) => {
    try {
      const deleteConfirm = confirm("You want delete this comment?");
      if (deleteConfirm == true) {
        const deleted = await axios.delete(
          `http://localhost:3000/posts/comments/${id}`
        );
        if (deleted.status == 200) {
          alert("Comment deleted successfuly");
          socket.emit("comment-proccess", { postId: post.id });
        }
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  // display reply comment when user klik button
  const displayReplyComment = (id) => {
    setDisplayBtnTarget(id);
  };
  const hideReplyComment = () => {
    setDisplayBtnTarget(null);
  };

  const postReplyComment = async (e) => {
    e.preventDefault();
    try {
      if (!isReplyToReply) {
        const sendReplyComment = await axios.post(
          `http://localhost:3000/posts/reply-comment/${commentId}`,
          {
            commentId,
            userId,
            referenced_username,
            message,
          }
        );
        setMessage("");
        setIsReply(false);
        socket.emit("comment-proccess", { postId: post.id });
      } else {
        const sendResponseToReply = await axios.post(
          `http://localhost:3000/posts/reply-comment/${parentReplyId}/${commentId}`,
          {
            commentId,
            userId,
            parentReplyId,
            referenced_username,
            message,
          }
        );
        setMessage("");
        setIsReply(false);
        socket.emit("comment-proccess", { postId: post.id });
      }
      // update reply comment
      // [ MASIH PROSES PERBAIKAN -> EDIT REPLY COMMENT ]
      if (isEditReplyComment) {
        const saveReplyCommentEdited = await axios.patch(
          `http://localhost:3000/posts/reply-comment/${commentId}`,
          {
            userId,
            message,
          }
        );
        if (saveReplyCommentEdited) {
          alert("Berhasil update reply comment!");
        }
        //debug
        if (saveReplyCommentEdited.error) {
          alert("gagal pante😎");
        }
        console.log("yg dijalanin function edit reply ");
        setMessage("");
      }
    } catch (error) {
      console.error(
        `[client error] an error occurred: ${error} [DETAIL]: ${error.stack}`
      );
    }
  };

  const deleteReplyComment = async (id) => {
    try {
      const deleteConfirm = confirm("You want delete this reply comment?");
      if (deleteConfirm == true) {
        const deletedReply = await axios.delete(
          `http://localhost:3000/posts/reply-comment/${id}`
        );
        if (deletedReply.status == 200) {
          alert("deleted reply comment successfully");
          socket.emit("comment-proccess", { postId: post.id });
        }
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  // manipulasi comment
  const handleToggleDropDownComment = (id) => {
    setSelectedCommentId(id);
    setSelectedReplyCommentId(null);
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleToggleDropDownReplyComment = (id) => {
    setSelectedReplyCommentId(id);
    setSelectedCommentId(null);
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center font-bold text-xl">
          Loading...
        </div>
      ) : (
        <div className="p-4">
          <h1 className="pb-2 border-b-2 border-indigo-300">
            {comments.length} {comments.length < 2 ? "Comment" : "Comments"}
          </h1>
          <div className="pt-4 border-[1px] p-2">
            {comments.length < 1 ? (
              <p className="text-center">
                There are no comments on this post yet, be the first to comment
              </p>
            ) : (
              <>
                {comments.map((comment) => (
                  <div className="mb-4" key={comment.id}>
                    <div className="flex gap-2">
                      {comment.user.profile_photo_url ? (
                        <img
                          src={comment.user.profile_photo_url}
                          className="flex justify-center items-center rounded-full  border-[1px] border-indigo-400 w-[30px] h-[30px]"
                        />
                      ) : (
                        <div className="flex justify-center items-center p-2 w-[30px] h-[30px] rounded-full border-[1px] border-indigo-400">
                          {comment.user.username[0]}
                        </div>
                      )}
                      <div className="border-[1px] pl-4 w-full">
                        <div className="flex">
                          <div className="w-full pt-1.5">
                            <p className="text-sm">
                              <span className="font-bold pr-3">
                                {isLogin && userId === comment.userId
                                  ? "You"
                                  : comment.user.username}{" "}
                              </span>{" "}
                              {moment(comment.createdAt)
                                .startOf("hour day")
                                .fromNow()}
                            </p>
                            <p className="text-md">{comment.message}</p>
                          </div>
                          {/* manipulate comment */}
                          <div className="relative my-2 mx-1 z-10">
                            <button
                              onClick={() =>
                                handleToggleDropDownComment(comment.id)
                              }
                            >
                              <CiMenuKebab />
                            </button>
                            {isDropdownOpen &&
                              selectedCommentId == comment.id && (
                                <div className="absolute bottom-0 right-2 top-5 w-[100px] p-1.5  h-14 shadow-md rounded-sm bg-white">
                                  {isLogin && userId === comment.userId ? (
                                    <>
                                      <button
                                        className="flex items-center gap-1.5 pl-2 pr-8 text-sm hover:bg-slate-100"
                                        value={JSON.stringify([
                                          comment.id,
                                          comment.message,
                                        ])}
                                        onClick={handleEditBtn}
                                      >
                                        <MdEdit /> Edit
                                      </button>
                                      <button
                                        className="flex items-center gap-1.5 pl-2 pr-6 mt-1.5 text-sm hover:bg-slate-100"
                                        onClick={() =>
                                          deleteComment(comment.id)
                                        }
                                      >
                                        <CiTrash /> Delete
                                      </button>
                                    </>
                                  ) : (
                                    <button className="text-sm">Report</button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        <button
                          className="bg-transparent text-sm text-slate-600 hover:bg-slate-100"
                          value={JSON.stringify([
                            comment.id,
                            comment.user.username,
                          ])}
                          onClick={handleReply}
                        >
                          reply
                        </button>
                        {comment.reply_comments < 1 ? (
                          ""
                        ) : (
                          <>
                            <div className="flex justify-center">
                              {displayBtnTarget == null ||
                              displayBtnTarget != comment.id ? (
                                <button
                                  className="py-2 px-1.5 text-sm text-slate-600 text-center hover:bg-slate-100"
                                  onClick={() =>
                                    displayReplyComment(comment.id)
                                  }
                                >
                                  see {comment.reply_comments.length}{" "}
                                  {comment.reply_comments.length < 2
                                    ? "reply"
                                    : "replies"}
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                            {comment.reply_comments.map((replies) => (
                              <div
                                className={`mt-4 flex gap-2 ${
                                  displayBtnTarget == comment.id ? "" : "hidden"
                                }`}
                                key={replies.id}
                              >
                                {replies.user.profile_photo_url ? (
                                  <img
                                    src={replies.user.profile_photo_url}
                                    className="flex justify-center items-center rounded-full  border-[1px] border-indigo-400 w-[30px] h-[30px]"
                                  />
                                ) : (
                                  <div className="flex justify-center items-center p-2 w-[30px] h-[30px] rounded-full border-[1px] border-indigo-400">
                                    {replies.user.username[0]}
                                  </div>
                                )}
                                <div className="mb-1.5 p-2 border-[1px] pl-4 w-full">
                                  <div className="flex">
                                    <div className="w-full pt-1.5">
                                      <p className="text-sm">
                                        <span className="font-bold pr-3">
                                          {isLogin && userId === replies.userId
                                            ? "You"
                                            : replies.user.username}
                                        </span>{" "}
                                        {moment(replies.createdAt)
                                          .startOf("hour day")
                                          .fromNow()}
                                      </p>
                                      <p className="text-md">
                                        <span className="text-blue-400">
                                          @{replies.referenced_username}
                                        </span>{" "}
                                        {replies.message}
                                      </p>
                                    </div>
                                    {/*<p>parent reply id : {replies.parentReplyId}</p> */}
                                    <div className="relative">
                                      <button
                                        onClick={() =>
                                          handleToggleDropDownReplyComment(
                                            replies.id
                                          )
                                        }
                                      >
                                        <CiMenuKebab />
                                      </button>
                                      {isDropdownOpen &&
                                        selectedReplyCommentId && (
                                          <div className="absolute bottom-0 right-2 top-5 w-[100px] p-1.5  h-14 shadow-md rounded-sm bg-white block">
                                            {isLogin &&
                                            userId === replies.userId ? (
                                              <>
                                                <button
                                                  className="flex items-center gap-1.5 pl-2 pr-8 text-sm hover:bg-slate-100"
                                                  value={JSON.stringify([
                                                    replies.id,
                                                    replies.message,
                                                  ])}
                                                  onClick={handleEditReplyBtn}
                                                >
                                                  <MdEdit /> Edit
                                                </button>
                                                <button
                                                  className="flex items-center gap-1.5 pl-2 pr-6 mt-1.5 text-sm bg-slate-100"
                                                  onClick={() =>
                                                    deleteReplyComment(
                                                      replies.id
                                                    )
                                                  }
                                                >
                                                  <CiTrash /> Delete
                                                </button>
                                              </>
                                            ) : (
                                              <button className="text-sm">
                                                Report
                                              </button>
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <button
                                    className="bg-transparent text-sm text-slate-600 hover:bg-slate-100"
                                    value={JSON.stringify([
                                      replies.id,
                                      replies.commentId,
                                      replies.user.username,
                                    ])}
                                    onClick={handleReplies}
                                  >
                                    reply
                                  </button>
                                </div>
                              </div>
                            ))}
                            {displayBtnTarget == comment.id &&
                            displayBtnTarget != null ? (
                              <div className="flex justify-center">
                                <button
                                  className="py-2 px-1.5 text-sm text-slate-600 text-center hover:bg-slate-100"
                                  onClick={hideReplyComment}
                                >
                                  hide{" "}
                                  {comment.reply_comments.length < 2
                                    ? "reply"
                                    : "replies"}
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {/* pop up penanda reply */}
          {isReply ? (
            <div className="flex bg-slate-100 p-2">
              <div className="w-full">reply @{userName}</div>
              <button className="text-lg" onClick={cancelReplyMessage}>
                <IoClose />
              </button>
            </div>
          ) : (
            ""
          )}

          {!isReply ? (
            <form
              className="border-2 flex items-center gap-1.5 p-2"
              onSubmit={postComment}
            >
              {userProfilePhoto ? (
                <img
                  src={userProfilePhoto}
                  className="flex justify-center items-center w-[38px] h-[35px] rounded-full overflow-hidden"
                />
              ) : (
                <div className="flex justify-center items-center text-white font-bold font-mono text-md p-3 w-[35px] h-[35px] bg-indigo-600 rounded-full">
                  {userNameIsLoggin[0]}
                </div>
              )}

              <input type="hidden" value={userId} />
              {/* <input type="hidden" value={postId} /> */}
              <input type="hidden" value={postId} />
              <textarea
                type="text"
                className="w-full h-[45px] py-2 px-4 border-[1px] rounded-lg"
                placeholder="type a comment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className={`h-[40px] px-2 rounded text-white text-lg ${
                  message.length < 1 ? "bg-indigo-200" : "bg-indigo-600"
                } `}
                disabled={message.length < 1}
              >
                <LuSendHorizonal />
              </button>
            </form>
          ) : (
            <form
              className="border-2 flex items-center gap-1.5 p-2"
              onSubmit={postReplyComment}
            >
              {userProfilePhoto ? (
                <img
                  src={userProfilePhoto}
                  className="flex justify-center items-center w-[38px] h-[35px] rounded-full overflow-hidden"
                />
              ) : (
                <div className="flex justify-center items-center text-white font-bold font-mono text-md p-3 w-[35px] h-[35px] bg-indigo-600 rounded-full">
                  {userNameIsLoggin[0]}
                </div>
              )}
              <input type="hidden" value={commentId} />
              <input type="hidden" value={userId} />
              <input type="hidden" value={referenced_username} />
              <textarea
                type="text"
                className="w-full h-[45px] py-2 px-4 border-[1px] rounded-lg"
                placeholder="type a reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className={`h-[40px] px-2 rounded text-white text-lg ${
                  message.length < 1 ? "bg-indigo-200" : "bg-indigo-600"
                } `}
                disabled={message.length < 1}
              >
                <LuSendHorizonal />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default Comments;
