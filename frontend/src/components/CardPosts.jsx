import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
// likes dislike button
import { SlHeart } from "react-icons/sl";
// import LikesBtn from '../../components/LikesBtn'
import { GoComment } from "react-icons/go";
import { auth } from "../middleware/auth";

const CardPosts = ({ userId, posts, socket }) => {
  // const [posts, setPosts] = useState([]);
  const [likesLength, setLikesLength] = useState(null);
  const { slug } = useParams();
  // status liked
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    userLiked();
  }, []);

  const likeDislike = async (id) => {
    const postId = id;
    const liked = await axios.post("http://localhost:3000/posts/like-dislike", {
      postId,
      userId,
    });
    socket.emit("like-dislike-process", { postId, userId });
  };
  // dev
  const userLiked = async () => {
    const getUserIdFromLike = posts.flatMap((post) =>
      post.likes.map((like) => like.userId)
    );
    let userIds = []; // Initialize an empty array
    // Use the previously modified 'reduce' function to populate the array
    userIds = getUserIdFromLike.reduce((userIds, userId) => {
      // Check if the userId already exists in the array
      if (!userIds.includes(userId)) {
        // If not, add it to the array
        userIds.push(userId);
      }
      // Return the updated array
      return userIds;
    }, userIds);
    // console.log(userIds)
    const foundIdIsLoggin = userIds.find((user) => user == userId);
    console.log("hasil id : " + foundIdIsLoggin);
    console.log("user is loggin : " + userId);
    if (foundIdIsLoggin) {
      console.log("cocok");
      setLiked(true);
    } else if (foundIdIsLoggin == undefined) {
      console.log("tidak cocok");
      setLiked(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen md:p-4">
        <div className="mx-2 mb-3">
          <div className="mt-3 flex justify-center">
            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:mx-6 xl:grid-cols-5">
              {posts.map((post) => (
                <div
                  className="w-full border border-slate-300 rounded-md p-2 hover:border-indigo-600 transition"
                  key={post.id}
                >
                  <div className="flex items-center w-full mb-2">
                    <div className="flex gap-2 items-center">
                      {post.user.profile_photo_url ? (
                        <img
                          src={post.user.profile_photo_url}
                          className="flex justify-center items-center w-[30px] h-[30px] border-[1px] font-mono border-indigo-400 overflow-hidden object-cover rounded-full"
                        />
                      ) : (
                        <p className="flex justify-center items-center w-[30px] h-[30px] p-2 bg-white border-[1px] font-mono border-indigo-400 rounded-full">
                          {post.user.username[0]}
                        </p>
                      )}
                      <div className="mt-2">
                        <Link
                          to={`/search/author/${post.user.id}/${post.user.username}`}
                          className="text-[12px] font-mono font-bold"
                        >
                          {post.user.username}
                        </Link>
                        <p className="text-[10px] text-slate-400 mb-2">
                          {moment(post.createdAt).format("MMMM dddd YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-[200px] w-full bg-slate-100 flex items-center justify-center"
                    />
                  </div>

                  <div className="flex justify-between">
                    <div className="p-1.5 w-11/12">
                      <Link
                        to={`/posts/${post.slug}`}
                        className="fs-4 font-bold mb-2 hover:text-indigo-400"
                      >
                        {post.title.length < 35
                          ? post.title
                          : post.title.substr(0, 35).concat("...")}{" "}
                        <Link
                          to={`/category/${post.category.slug}`}
                          className="ml-3 text-[8px] mb-6 bg-indigo-300 py-0.5 px-1.5 text-white rounded border-[1px] border-indigo-500"
                        >
                          {post.category.name}
                        </Link>
                      </Link>

                      {/*like & dislike btn*/}
                      <div className="mt-2 flex gap-2">
                        <button
                          className={`text-xl ${liked ? "text-red-500" : ""}`}
                          onClick={() => likeDislike(post.id)}
                        >
                          <SlHeart />
                        </button>
                        <Link to={`/posts/${post.slug}`} className="text-2xl">
                          <GoComment />
                        </Link>
                      </div>
                      <p className="mt-1.5 text-[14px]">
                        {post.likes.length} likes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPosts;
