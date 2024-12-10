import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import PopupSuccess from "./popups/PopupSuccess.jsx";
import ConfirmPopup from "./popups/ConfirmPopup.jsx";
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
  const [replyCommentId, setReplyCommentId] = useState("");
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
  // popup state
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [replyCommentToDelete, setReplyCommentToDelete] = useState(null);
  const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);
  const [isShowReplyConfirmBox, setIsShowReplyConfirmBox] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [successDeleted, setSuccessDeleted] = useState(false);
  const [successSendComment, setSuccessSendComment] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");

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
      const getFullDataUserIsLoggin = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      const { id, message, state } = JSON.parse(e.target.value);
      if (state == "comment") {
        setCommentId(id);
        setIsEditComment(true);
      }
      if (state == "reply") {
        setReplyCommentId(id);
        setIsEditReplyComment(true);
        alert("Fitur ini masih bug!, sedang tahap perbaikan.");
      }
      setMessage(message);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    try {
      if (!isEditComment && !isEditReplyComment) {
        const sendComment = await axios.post(
          `http://localhost:3000/posts/comments/${postId}`,
          {
            postId,
            userId,
            message,
          }
        );
        if (sendComment.status == 201) {
          setSuccessSendComment(true);
          setSuccessPopupTitle("Send Comment");
          setSuccessPopupMsg("Sending your comment...");
          setMessage("");
          setTimeout(async () => {
            const commentMsg = { postId, userId, message };
            socket.emit("comment-proccess", commentMsg);
          }, 5000);
        }
      }
      if (!isEditReplyComment) {
        // edit comment
        const saveCommentEditted = await axios.patch(
          `http://localhost:3000/posts/comments/${commentId}`,
          {
            userId,
            message,
          }
        );
        if (saveCommentEditted.status == 200) {
          setSuccessSendComment(true);
          setSuccessPopupTitle("Update Comment");
          setSuccessPopupMsg("Sending your updated comment...");
          setMessage("");
          setIsEditComment(false);
          setIsDropdownOpen(false);
          setTimeout(async () => {
            socket.emit("comment-proccess", { postId: post.id });
          }, 5000);
        }
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  const resetSendingCommentSuccess = () => setSuccessSendComment(false);

  const deleteConfirm = (id) => {
    setIsDropdownOpen(false);
    setCommentToDelete(id);
    setIsShowConfirmBox(true);
    setConfirmTitle("Delete Comment");
    setConfirmMsg(
      "Are you sure you want to delete this Comment? This action cannot be undone."
    );
  };

  const deleteComment = async () => {
    try {
      if (commentToDelete) {
        const deleted = await axios.delete(
          `http://localhost:3000/posts/comments/${commentToDelete}`
        );
        if (deleted.status == 200) {
          setSuccessDeleted(true);
          setSuccessPopupTitle("Delete Comment");
          setSuccessPopupMsg("Comment deleted successfully!");
          socket.emit("comment-proccess", { postId: post.id });
        }
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  const resetSuccessDeleted = () => setSuccessDeleted(false);

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
        if (sendReplyComment.status == 201) {
          setSuccessSendComment(true);
          setSuccessPopupTitle("Send Reply Comment");
          setSuccessPopupMsg("Sending your reply comment...");
          setMessage("");
          setIsReply(false);
          setTimeout(async () => {
            socket.emit("comment-proccess", { postId: post.id });
          }, 5000);
        }
      } else if (isEditReplyComment) {
        const sendReplyEditted = await axios.patch(
          `http://localhost:3000/posts/reply-comment/${replyCommentId}`,
          {
            userId,
            message,
          }
        );
        if (sendReplyEditted.status == 200) {
          alert("Reply comment editted successfully");
        }
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
        if (sendResponseToReply.status == 201) {
          setSuccessSendComment(true);
          setSuccessPopupTitle("Send Reply Comment");
          setSuccessPopupMsg("Sending your reply comment...");
          setMessage("");
          setIsReply(false);
          setTimeout(async () => {
            socket.emit("comment-proccess", { postId: post.id });
          }, 5000);
        }
      }
    } catch (error) {
      console.error(
        `[client error] an error occurred: ${error} [DETAIL]: ${error.stack}`
      );
    }
  };

  const deleteReplyConfirm = (id) => {
    setIsDropdownOpen(false);
    setReplyCommentToDelete(id);
    setIsShowReplyConfirmBox(true);
    setConfirmTitle("Delete Reply Comment");
    setConfirmMsg(
      "Are you sure you want to delete this Reply Comment? This action cannot be undone."
    );
  };
  const deleteReplyComment = async () => {
    try {
      if (replyCommentToDelete) {
        const deletedReply = await axios.delete(
          `http://localhost:3000/posts/reply-comment/${replyCommentToDelete}`
        );
        if (deletedReply.status == 200) {
          setSuccessDeleted(true);
          setSuccessPopupTitle("Delete Reply Comment");
          setSuccessPopupMsg("Reply Comment deleted successfully!");
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
                {/* Confirm delete popup */}
                {isShowConfirmBox && (
                  <ConfirmPopup
                    title={confirmTitle}
                    message={confirmMsg}
                    onConfirmDelete={deleteComment}
                    onCloseConfirmBox={() => setIsShowConfirmBox(false)}
                  />
                )}
                {/* Success deleted popup */}
                {successDeleted ? (
                  <PopupSuccess
                    state={successDeleted}
                    title={successPopupTitle}
                    message={successPopupMsg}
                    onClose={resetSuccessDeleted}
                  />
                ) : (
                  ""
                )}
                {comments.map((comment) => (
                  <div className="mb-4" key={comment.id}>
                    <div className="flex gap-2">
                      {comment.user.profile_photo_url ? (
                        <img
                          src={comment.user.profile_photo_url}
                          className="flex justify-center items-center rounded-full border-[1px] border-indigo-400 w-[30px] h-[30px] overflow-hidden object-cover"
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
                                        value={JSON.stringify({
                                          id: comment.id,
                                          message: comment.message,
                                          state: "comment",
                                        })}
                                        onClick={handleEditBtn}
                                      >
                                        <MdEdit /> Edit
                                      </button>
                                      <button
                                        className="flex items-center gap-1.5 pl-2 pr-6 mt-1.5 text-sm hover:bg-slate-100"
                                        onClick={() =>
                                          deleteConfirm(comment.id)
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
                            {/* Confirm delete reply popup */}
                            {isShowReplyConfirmBox && (
                              <ConfirmPopup
                                title={confirmTitle}
                                message={confirmMsg}
                                onConfirmDelete={deleteReplyComment}
                                onCloseConfirmBox={() =>
                                  setIsShowReplyConfirmBox(false)
                                }
                              />
                            )}
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
                                    className="flex justify-center items-center rounded-full  border-[1px] border-indigo-400 w-[30px] h-[30px] object-cover overflow-hidden"
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
                                        selectedReplyCommentId ==
                                          replies.id && (
                                          <div className="absolute bottom-0 right-2 top-5 w-[100px] p-1.5  h-14 shadow-md rounded-sm bg-white block">
                                            {isLogin &&
                                            userId === replies.userId ? (
                                              <>
                                                <button
                                                  className="flex items-center gap-1.5 pl-2 pr-8 text-sm hover:bg-slate-100"
                                                  value={JSON.stringify({
                                                    id: replies.id,
                                                    message: replies.message,
                                                    state: "reply",
                                                  })}
                                                  onClick={handleEditBtn}
                                                >
                                                  <MdEdit /> Edit
                                                </button>
                                                <button
                                                  className="flex items-center gap-1.5 pl-2 pr-6 mt-1.5 text-sm bg-slate-100"
                                                  onClick={() =>
                                                    deleteReplyConfirm(
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
              {successSendComment ? (
                <PopupSuccess
                  state={successSendComment}
                  title={successPopupTitle}
                  message={successPopupMsg}
                  onClose={resetSendingCommentSuccess}
                />
              ) : (
                ""
              )}
              {userProfilePhoto ? (
                <img
                  src={userProfilePhoto}
                  className="flex justify-center items-center w-[35px] h-[35px] rounded-full overflow-hidden object-cover"
                />
              ) : (
                <div className="flex justify-center items-center text-white font-bold font-mono text-md p-3 w-[35px] h-[35px] bg-indigo-600 rounded-full">
                  {userNameIsLoggin[0]}
                </div>
              )}

              <input type="hidden" value={userId} />
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
                  className="flex justify-center items-center w-[35px] h-[35px] rounded-full overflow-hidden object-cover"
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
