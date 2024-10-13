// This section use for display profile author selected
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const AuthorProfile = ({ userIdIsLoggin, id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");
  const [countPosts, setCountPosts] = useState(null);
  // sementara ngaff
  const [userAbout, setUserAbout] = useState("");
  const [profilPhoto, setProfilPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    getProfile();
    getConversation();
  }, [userIdIsLoggin]);

  const getProfile = async () => {
    try {
      const userData = await axios.get(
        `http://localhost:3000/other-profile-user/${id}`
      );
      console.log({ userData });
      setUser(userData.data.userProfile);
      setCountPosts(userData.data.userProfile.posts.length);
      // get first index string for profile photo
      const username = userData.data.userProfile.username;
      const firstLetter = username.charAt(0);
      setUserAbout(userData.data.userProfile.about);
      setProfilPhoto(firstLetter);
      setPhotoUrl(userData.data.userProfile.profile_photo_url);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getConversation = async () => {
    const response = await axios.get(
      `http://localhost:3000/chats/content/${userIdIsLoggin}/${id}`
    );
    setConversationId(response.data[1].data.id);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center font-bold text-xl">
          Loading...
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex gap-3 justify-center m-2">
            {photoUrl ? (
              <img
                src={photoUrl}
                className="w-[70px] h-[70px] mt-2 flex justify-center items-center rounded-full border-2 border-fuchsia-400 overflow-hidden"
              />
            ) : (
              <div className="w-[70px] h-[70px] mt-2 flex justify-center items-center bg-indigo-400 text-white text-xl font-mono font-bold rounded-full border-2 border-fuchsia-400">
                {profilPhoto}
              </div>
            )}

            <div className="p-2">
              <h1 className="text-2xl font-bold font-mono mb-2">
                {user.username}
              </h1>
              <p className="text-lg">{userAbout}</p>
              <div className="flex gap-3">
                <p>{countPosts} posts</p>
                <p>25k Followers</p>
                <p>5k Following</p>
              </div>
              <p className="py-2 text-[15px]">
                Joined at {moment(user.createdAt).format("MMMM YYYY")}
              </p>
              <div className="mt-3 flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Follow
                </button>
                <Link
                  to={`/chats/content/${id}/${
                    conversationId ? conversationId : "$hsj59haha4pkw1js46-a"
                  }`}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Messege
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthorProfile;
