// This section use for display profile author selected
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { IoShareSocialSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import FollowUnfollowBtn from "../../components/FollowUnfollowBtn";

const AuthorProfile = ({ userIdIsLoggin, id }) => {
  const [conversationId, setConversationId] = useState("");
  const [authorProfileData, setAuthorProfileData] = useState("");
  const [followersTotal, setFollowersTotal] = useState(0);
  const [followingTotal, setFollowingTotal] = useState(0);
  const [actionState, setActionState] = useState("");
  const [followDisplayState, setFollowDisplayState] = useState("");

  useEffect(() => {
    getProfile();
    getConversation();
  }, [userIdIsLoggin]);

  const getProfile = async () => {
    try {
      // get profile user selected
      const userData = await axios.get(
        `http://localhost:3000/other-profile-user/${id}/${userIdIsLoggin}`
      );
      // get followers and following total user selected
      const getFollowers = await axios.get(
        `http://localhost:3000/api/followers/${id}`
      );
      const getFollowing = await axios.get(
        `http://localhost:3000/api/following/${id}`
      );
      setFollowersTotal(getFollowers.data.followers_total);
      setFollowingTotal(getFollowing.data.following_total);

      const data = [userData.data.userProfile];
      setAuthorProfileData([userData.data.userProfile]);
      data.map((foll) => {
        if (foll.followers_followings.length == 0) {
          setActionState("create");
          setFollowDisplayState("Follow");
          return;
        }
        const follback_or_follow = foll.followers_followings.map((data) => {
          if (
            data.userId_following == userIdIsLoggin &&
            data.state_following == true &&
            data.userId_followers == null
          ) {
            setActionState("follback");
            setFollowDisplayState("Follback");
          } else {
            setActionState("follow_or_unfollow");
            if (
              data.userId_followers == userIdIsLoggin &&
              data.state_followers == true
            ) {
              setFollowDisplayState("Unfollow");
            } else if (
              data.userId_following == userIdIsLoggin &&
              data.state_following == true &&
              data.state_followers == false
            ) {
              setFollowDisplayState("Follback");
            } else {
              setFollowDisplayState("Follow");
            }
          }
        });
      });
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const getConversation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/chats/content/${userIdIsLoggin}/${id}`
      );
      setConversationId(response.data[1].data.id);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  return (
    <>
      {authorProfileData && (
        <div className="mt-6">
          {authorProfileData.map((profile) => (
            <div
              className="flex flex-col md:flex-row gap-3 justify-center items-center md:items-start m-2 p-4"
              key={profile.id}
            >
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={`${profile.username}'s profile`}
                  className="w-[70px] h-[70px] flex justify-center items-center rounded-full border-2 border-fuchsia-400 overflow-hidden object-cover"
                />
              ) : (
                <div className="w-[70px] h-[70px] flex justify-center items-center bg-indigo-400 text-white text-xl font-mono font-bold rounded-full border-2 border-fuchsia-400">
                  {profile.username.charAt(0)}
                </div>
              )}

              <div className="p-2 text-center md:text-left">
                <h1 className="text-2xl font-bold font-mono mb-2">
                  {profile.username}
                </h1>
                <p className="text-lg">{profile.about}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                  <p>{profile.posts.length} posts</p>
                  <Link
                    to={`/${profile.username}/${id}/followers_following?action=followers`}
                    className="cursor-pointer hover:text-indigo-600"
                  >
                    {followersTotal} Followers
                  </Link>
                  <Link
                    to={`/${profile.username}/${id}/followers_following?action=following`}
                    className="cursor-pointer hover:text-indigo-600"
                  >
                    {followingTotal} Following
                  </Link>
                </div>
                <p className="py-2 text-[15px]">
                  Joined at {moment(profile.createdAt).format("MMMM YYYY")}
                </p>
                {id == userIdIsLoggin ? (
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Link
                      to="/edit-profile"
                      className="flex justify-center items-center font-semibold gap-2 w-full md:w-auto py-2 px-4 rounded-3xl border-[1.5px] border-slate-500 hover:bg-indigo-500 hover:text-white"
                    >
                      <MdEdit /> Edit profile
                    </Link>
                    <button className="text-2xl">
                      <IoShareSocialSharp />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    <FollowUnfollowBtn
                      userId_selected={id}
                      user_id_authorized={userIdIsLoggin}
                      action={actionState}
                      btn_display_state={followDisplayState}
                      refresh_data_updated={() => getProfile()}
                    />
                    <Link
                      to={`/chats/content/${id}/${
                        conversationId
                          ? conversationId
                          : "$hsj59haha4pkw1js46-a"
                      }`}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Message
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AuthorProfile;
