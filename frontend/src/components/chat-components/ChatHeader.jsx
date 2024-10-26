import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const ChatHeader = ({ idInterlocutor, alternativeIdInterlocutor }) => {
  const [usernameInterlocutor, setUsernameInterlocutor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsernameInterlocutor();
  }, [idInterlocutor]);

  const getUsernameInterlocutor = async () => {
    const response = await axios.get(
      `http://localhost:3000/users/${
        idInterlocutor ? idInterlocutor : alternativeIdInterlocutor
      }`
    );
    setUsernameInterlocutor(response.data.data[0].username);
    console.log("username interlocutor: ", usernameInterlocutor[0]);
    console.log("Get username: ", response.data.data[0].username);
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
          <div className="p-2 flex justify-center items-center w-[40px] h-[40px] rounded-full bg-slate-100 font-bold">
            {usernameInterlocutor[0]}
          </div>
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
