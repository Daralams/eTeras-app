// Middleware
import { auth } from "../../middleware/auth.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SecondNavbar from "../../components/SecondNavbar";
import ChatItem from "../../components/chat-components/ChatItem";
import Loading from "../../components/Loading.jsx";

const MyChats = () => {
  const [userIdIsLoggin, setUserIdIsLoggin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    userIsLoggin();
  }, [userIdIsLoggin]);

  const userIsLoggin = async () => {
    try {
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      setUserIdIsLoggin(authorization.userId);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SecondNavbar title="Chats" />
          <ChatItem userIdIsLoggin={userIdIsLoggin} />
        </>
      )}
    </>
  );
};

export default MyChats;
