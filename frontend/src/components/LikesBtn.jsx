import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { SlHeart } from "react-icons/sl";

/* !! COMPONEN INI BELUM DI PAKE NGAFF MASIH BELUM JALAN, SEMENTARA TOMBOLNYA MASIH JADI SATU AMA CARD POST !! */
const LikesBtn = () => {
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    getLikesPost();
    socket.on("show-recent-like-total", (likesTotal) => {
      console.log({ likesTotal });
    });
  });
  const socket = io("http://localhost:3000");

  const getLikesPost = async () => {
    try {
      // request new accesstoken
      const getToken = await axios.get("http://localhost:3000/token");

      const decoded = jwtDecode(getToken.data[1].RefreshToken);
      setUserName(decoded.userName);

      // request page using accessToken
      const response = await axios.get("http://localhost:3000/posts", {
        headers: { Authorization: `Bearer ${getToken.data[0].accessToken}` },
      });
      setToken(getToken.data.accessToken);
      setLikes(response.data[1].data);
      socket.emit("like-dislike-process", response.data[1].data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const result = posts.map(post => post.likes.map(like => console.log(like))

  return (
    <>
      {/* {likes.map(posts => (
      <div key={posts.id} className="absolute text-center bottom-1 right-2">
      {posts.likes.map(like => (
      <div key={like.id}>
          <button className="text-xl">
            <SlHeart />
          </button>
          <p className="text-center text-[10px]">{like.postId}</p>
        </div>
      ))}
      </div>
    ))} */}
      {likes.map((post) => post.likes.map((like) => <p>{like.status}</p>))}
    </>
  );
};

export default LikesBtn;
