import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SecondNavbar from "../../components/SecondNavbar";
import { auth } from "../../middleware/auth";
import Loading from "../../components/Loading";

const AccountSettings = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLogin, setUserLogin] = useState([]);
  const [userId, setUserId] = useState(0);
  const [userName, setUsername] = useState("");
  const [userAbout, setUserAbout] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userProfilePhotoName, setUserProfilePhotoName] = useState("");
  const [previewImgProfile, setPreviewImgProfile] = useState("");
  const [userDateBirth, setUserDateBirth] = useState("");
  const [userRegisterAt, setUserRegisterAt] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    authorization();
  }, []);

  const authorization = async () => {
    try {
      const user = await auth();
      setToken(user.accessToken);
      if (!user) {
        navigate("/login");
      }
      const userAuthorized = await axios.get(
        `http://localhost:3000/users/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      setUserLogin(userAuthorized.data.data);
      setUserId(userAuthorized.data.data[0].id);
      setUsername(userAuthorized.data.data[0].username);
      setUserAbout(userAuthorized.data.data[0].about);
      setUserEmail(userAuthorized.data.data[0].email);
      setUserProfilePhotoName(userAuthorized.data.data[0].profile_photo_name);
      setPreviewImgProfile(userAuthorized.data.data[0].profile_photo_url);
      setUserDateBirth(
        moment(userAuthorized.data.data[0].date_of_birth).format("YYYY-MM-DD")
      );
      setUserRegisterAt(
        moment(userAuthorized.data.data[0].createdAt).format("YYYY-MM-DD")
      );
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadImage = (e) => {
    const userProfilePhoto = e.target.files[0];
    setUserProfilePhotoName(userProfilePhoto);
    setPreviewImgProfile(URL.createObjectURL(userProfilePhoto));
  };

  const deleteProfilePhoto = async () => {
    const confirmDelete = confirm("delete profile photo?");
    if (confirmDelete) {
      try {
        const requestDelete = await axios.patch(
          `http://localhost:3000/dashboard/settings/delete-profile-photo/${userId}`
        );
        if (requestDelete) {
          setUserProfilePhotoName(null);
          setPreviewImgProfile(null);
          alert(requestDelete.data.msg);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (error) {
        console.error(`[client error] an error occurred: ${error}`);
      }
    }
  };

  const discardChanges = () => {
    const cancelChanges = confirm(
      "Are you sure you want to leave? Your changes will not be saved"
    );
    if (cancelChanges) {
      navigate("/dashboard");
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("username", userName);
    formdata.append("email", userEmail);
    formdata.append("profile_photo_name", userProfilePhotoName);
    formdata.append("about", userAbout);
    formdata.append("date_of_birth", userDateBirth);
    try {
      const requestChange = await axios.patch(
        `http://localhost:3000/dashboard/settings/${userId}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User mengirim data", formdata);
      alert(requestChange.data.msg);
      navigate("/dashboard");
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SecondNavbar title="Settings" />
          <div className="m-5">
            <form
              className="flex flex-col justify-center items-center mt-4"
              onSubmit={updateUserProfile}
            >
              <div className="shadow-lg rounded-md w-1/2 p-4">
                <div className="mt-5 flex flex-col justify-center items-center">
                  {previewImgProfile ? (
                    <div className="flex justify-center items-center  w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-indigo-600">
                      <img
                        src={previewImgProfile}
                        alt="preview img profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center  w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 bg-indigo-400 rounded-full">
                      <p className="font-bold text-3xl text-white">
                        {userName[0]}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div
                      className=" mt-3 w-8 h-8 p-2 bg-red-500 text-white cursor-pointer rounded relative"
                      onClick={deleteProfilePhoto}
                    >
                      <MdDelete />
                    </div>
                    <div className=" mt-3 w-8 h-8 p-2 bg-blue-500 text-white cursor-pointer rounded relative">
                      <FaRegEdit />
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={loadImage}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="username">Username</label>
                  <br />
                  <input
                    type="text"
                    className="mt-2 py-2 px-4 border-[1px] border-slate-950 rounded-md w-full"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="about">About</label>
                  <br />
                  <textarea
                    className="mt-2 py-2 px-4 border-[1px] border-slate-950 rounded-md w-full"
                    value={userAbout}
                    onChange={(e) => setUserAbout(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    type="email"
                    className="mt-2 py-2 px-4 border-[1px] border-slate-950 rounded-md w-full"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="date_of_birth">Date of birth</label>
                  <br />
                  <input
                    type="date"
                    className="mt-2 py-2 px-4 border-[1px] border-slate-950 rounded-md w-full"
                    value={userDateBirth}
                    onChange={(e) => setUserDateBirth(e.target.value)}
                    required="true"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="joined_at">Joined at</label>
                  <br />
                  <input
                    type="date"
                    className="mt-2 py-2 px-4 border-[1px] border-slate-950 rounded-md w-full"
                    value={userRegisterAt}
                    readOnly="1"
                  />
                </div>
              </div>
              <div className="flex gap-2 m-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-bold bg-indigo-600 hover:bg-indigo-400 rounded"
                >
                  Edit profile
                </button>
                <div
                  type="submit"
                  className="px-4 py-2 text-white font-bold bg-slate-500 hover:bg-slate-400 rounded cursor-pointer"
                  onClick={discardChanges}
                >
                  Discard
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default AccountSettings;
