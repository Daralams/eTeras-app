import React, { useEffect, useState } from "react";
import SecondNavbar from "../../components/SecondNavbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../middleware/auth.js";
import { Link } from "react-router-dom";

const FollowersFollowing = () => {
  const [userIdAuthorized, setUserAuthorized] = useState(null);
  const [actionState, setActionState] = useState("");
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [isLoadData, setIsLoadData] = useState(true);
  const [activeButton, setActiveButton] = useState("followers");

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get("action");
    setActionState(action);
    setActiveButton(action);

    if (action === "followers") {
      getFollowers();
    } else if (action === "following") {
      getFollowing();
    }

    const fetchUserAuthorization = async () => {
      try {
        const userAuthorized = await auth();
        if (!userAuthorized) {
          navigate("/login");
        }
        setUserAuthorized(userAuthorized.userId);
      } catch (error) {
        console.error("Error during auth:", error);
      }
    };
    fetchUserAuthorization();
  }, [location.search]);

  const handleButtonClick = (type) => {
    setActiveButton(type || actionState);
    if (type === "followers") {
      getFollowers();
    } else if (type === "following") {
      getFollowing();
    }
  };

  const getFollowers = async () => {
    try {
      const followers = await axios.get(
        `http://localhost:3000/api/followers/${id}`
      );
      if (followers.status == 200) {
        setTimeout(() => {
          setFollowersData(followers.data.data);
          setIsLoadData(false);
        }, 500);
        setActionState("followers");
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  const getFollowing = async () => {
    try {
      const following = await axios.get(
        `http://localhost:3000/api/following/${id}`
      );
      if (following.status == 200) {
        setTimeout(() => {
          setFollowingData(following.data.data);
          setIsLoadData(false);
        }, 500);
        setActionState("following");
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  return (
    <>
      <SecondNavbar />
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <button
            className={`border-2 rounded-lg px-6 py-2 font-medium transition-all ${
              activeButton === "followers"
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
            }`}
            onClick={() => handleButtonClick("followers")}
          >
            Followers
          </button>
          <button
            className={`border-2 rounded-lg px-6 py-2 font-medium transition-all ${
              activeButton === "following"
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
            }`}
            onClick={() => handleButtonClick("following")}
          >
            Following
          </button>
        </div>
        <div className="w-full max-w-lg">
          {isLoadData ? (
            <div className="flex justify-center mt-4">
              <div className="loader border-t-4 border-indigo-600 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(actionState === "followers"
                ? followersData
                : followingData
              ).map((item) => {
                const user =
                  actionState === "followers" ? item.followers : item.following;
                return (
                  <Link
                    to={`/search/author/${user.id}/${user.username}`}
                    key={user.id}
                    className="flex items-center justify-between p-2 border-b hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10">
                        {user.profile_photo_url ? (
                          <img
                            src={user.profile_photo_url}
                            className="w-full h-full rounded-full object-cover"
                            alt={user.username}
                          />
                        ) : (
                          <div className="flex justify-center items-center w-full h-full border-2 border-indigo-600 rounded-full text-indigo-600 font-bold text-sm">
                            {user.username.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-base">
                          {user.username}
                        </h4>
                      </div>
                    </div>
                    <div>
                      {user.id === userIdAuthorized ? (
                        <Link
                          to="/dashboard"
                          className="px-4 py-1 bg-gray-300 text-sm rounded-lg"
                        >
                          my profile
                        </Link>
                      ) : (
                        <Link
                          to={`/search/author/${user.id}/${user.username}`}
                          className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                        >
                          see profile
                        </Link>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FollowersFollowing;
