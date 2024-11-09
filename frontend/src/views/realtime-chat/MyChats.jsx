// Middleware
import { auth } from "../../middleware/auth.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SecondNavbar from "../../components/SecondNavbar";
import ChatItem from "../../components/chat-components/ChatItem";

const MyChats = () => {
  const [userIdIsLoggin, setUserIdIsLoggin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userIsLoggin();
  }, [userIdIsLoggin]);

  const userIsLoggin = async () => {
    const authorization = await auth();
    if (!authorization) {
      navigate("/login");
    }
    setUserIdIsLoggin(authorization.userId);
  };

  return (
    <>
      <SecondNavbar title="Chats" />
      <ChatItem userIdIsLoggin={userIdIsLoggin} />
    </>
  );
};

export default MyChats;
