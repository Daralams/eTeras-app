import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../middleware/auth";
import { IoArrowBack } from "react-icons/io5";

const ChatHeader = ({ idInterlocutor, alternativeIdInterlocutor }) => {
  const [usernameInterlocutor, setUsernameInterlocutor] = useState("");
  const [profilePhotoInterlocutor, setProfilePhotoInterlocutor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsernameInterlocutor();
  }, [idInterlocutor]);

  const getUsernameInterlocutor = async () => {
    const authorization = await auth();
    if (!authorization) {
      navigate("/login");
    }
    const response = await axios.get(
      `http://localhost:3000/users/${
        idInterlocutor ? idInterlocutor : alternativeIdInterlocutor
      }`,
      {
        headers: { Authorization: `Bearer ${authorization.accessToken}` },
      }
    );
    setUsernameInterlocutor(response.data.data[0].username);
    setProfilePhotoInterlocutor(response.data.data[0].profile_photo_url);
  };

  return (
    <div className="bg-indigo-600 p-3 top-0 sticky w-full z-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-white font-bold"
          >
            <IoArrowBack />
          </button>
          {profilePhotoInterlocutor ? (
            <img
              src={profilePhotoInterlocutor}
              className="flex justify-center items-center w-[40px] h-[40px] rounded-full border-[1px] border-white overflow-hidden object-cover"
            />
          ) : (
            <div className="p-2 flex justify-center items-center w-[40px] h-[40px] rounded-full bg-slate-100 font-bold">
              {usernameInterlocutor[0]}
            </div>
          )}

          <div className="flex flex-col">
            <p className="font-bold text-white">{usernameInterlocutor}</p>
            <p className="text-white text-sm">online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
