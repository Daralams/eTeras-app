import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SecondNavbar from "../../components/SecondNavbar";
import { auth } from "../../middleware/auth";
import Loading from "../../components/Loading";
import PopupSuccess from "../../components/popups/PopupSuccess";
import AuthFailed from "../../components/popups/AuthFailed";
import ConfirmPopup from "../../components/popups/ConfirmPopup";
import Footer from "../../components/Footer";

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
  const [successUpdateProfile, setSuccessUpdateProfile] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");
  const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);
  const [isDeleteProfile, setIsDeleteProfile] = useState(false);
  const [isDiscardChanges, setIsDiscardChanges] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
    try {
      const userProfilePhoto = e.target.files[0];
      console.log({ userProfilePhoto });
      setUserProfilePhotoName(userProfilePhoto);
      setPreviewImgProfile(URL.createObjectURL(userProfilePhoto));
    } catch (error) {
      setIsError(error);
      setErrorMsg(error.message);
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const handleConfirm = async (state) => {
    if (state == "delete") {
      setIsDeleteProfile(true);
      setConfirmTitle("Delete profile photo");
      setConfirmMsg(
        "Are you sure you want to delete this profile photo? This action cannot be undone."
      );
    }
    if (state == "discard") {
      setIsDiscardChanges(true);
      setConfirmTitle("Discard Changes");
      setConfirmMsg(
        "Are you sure you want to leave? Your changes will not be saved"
      );
    }
    setIsShowConfirmBox(true);
  };

  const deleteProfilePhoto = async () => {
    if (isDeleteProfile) {
      try {
        const requestDelete = await axios.patch(
          `http://localhost:3000/dashboard/settings/delete-profile-photo/${userId}`
        );
        if (requestDelete.status == 201) {
          setSuccessUpdateProfile(true);
          setSuccessPopupTitle("Delete profile photo");
          setSuccessPopupMsg("Profile photo deleted successfully");
          setTimeout(() => {
            navigate("/dashboard");
          }, 5000);
        }
      } catch (error) {
        setIsError(true);
        setErrorMsg(error.message);
        console.error(`[client error] an error occurred: ${error}`);
      }
    }
  };

  const discardChanges = () => {
    if (isDiscardChanges) {
      navigate("/dashboard");
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    const user = await auth();
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
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (requestChange.status == 201) {
        setSuccessUpdateProfile(true);
        setSuccessPopupTitle("Update profile");
        setSuccessPopupMsg("Profile updated successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      }
    } catch (error) {
      setIsError(true);
      setErrorMsg(error.response.data.msg);
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  const resetSuccessUpdated = () => setSuccessUpdateProfile(false);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SecondNavbar title="Settings" />
          <div className="min-h-screen">
            <div className="m-5 flex flex-col items-center">
              {successUpdateProfile && (
                <PopupSuccess
                  state={successUpdateProfile}
                  title={successPopupTitle}
                  message={successPopupMsg}
                  onClose={resetSuccessUpdated}
                />
              )}
              {isError && (
                <div className="fixed top-5 right-5 z-50 text-white rounded-md shadow-lg">
                  <AuthFailed error={errorMsg} />
                </div>
              )}
              {isShowConfirmBox && isDeleteProfile && (
                <ConfirmPopup
                  title={confirmTitle}
                  message={confirmMsg}
                  onConfirmDelete={deleteProfilePhoto}
                  onCloseConfirmBox={() => setIsShowConfirmBox(false)}
                />
              )}
              {isShowConfirmBox && isDiscardChanges && (
                <ConfirmPopup
                  title={confirmTitle}
                  message={confirmMsg}
                  onConfirmDelete={discardChanges}
                  onCloseConfirmBox={() => setIsShowConfirmBox(false)}
                />
              )}
              <form
                className="w-full max-w-lg bg-white shadow-md rounded-md p-6 border"
                onSubmit={updateUserProfile}
              >
                <div className="flex flex-col items-center mb-5">
                  <div className="relative w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-indigo-600">
                    {previewImgProfile ? (
                      <img
                        src={previewImgProfile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-[20vw] h-[20vw] max-w-52 max-h-52 min-w-32 min-h-32 sm:w-32 sm:h-32 bg-indigo-500 rounded-full text-white text-2xl font-bold">
                        {userName[0]}
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 bg-black bg-opacity-50 text-white">
                      <FaRegEdit />
                      <input
                        type="file"
                        className="hidden"
                        onChange={loadImage}
                      />
                    </label>
                  </div>
                  <div
                    className=" mt-3 w-8 h-8 p-2 bg-red-500 text-white cursor-pointer rounded relative"
                    onClick={() => handleConfirm("delete")}
                  >
                    <MdDelete />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">About</label>
                    <textarea
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userAbout}
                      onChange={(e) => setUserAbout(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Email</label>
                    <input
                      type="email"
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userDateBirth}
                      onChange={(e) => setUserDateBirth(e.target.value)}
                      required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">
                      Joined at
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userRegisterAt}
                      readOnly="1"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                    onClick={() => handleConfirm("discard")}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default AccountSettings;
