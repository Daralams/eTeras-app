import io from "socket.io-client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";
import ChatHeader from "../../components/chat-components/ChatHeader";
import ChatContent from "../../components/chat-components/ChatContent";
import ChatInput from "../../components/chat-components/ChatInput";

const socket = io("http://localhost:3000");

const ChatWindow = () => {
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [date, setDate] = useState("");
  const { userId: alternativeIdInterlocutor, conversation_id } = useParams();

  useEffect(() => {
    getUserIdIsLogin();
    getReceiverIdFromConversation();
  }, [senderId]);

  const getUserIdIsLogin = async () => {
    const authorization = await auth();
    setSenderId(authorization.userId);
  };

  const getReceiverIdFromConversation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/chats/content/${conversation_id}`
      );
      const id_value = response.data.data;
      setDate(id_value.createdAt);
      if (id_value.userId_1 !== senderId) {
        setReceiverId(id_value.userId_1);
        return;
      }
      if (id_value.userId_2 !== senderId) {
        setReceiverId(id_value.userId_2);
        return;
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  return (
    <div className="relative h-screen">
      <ChatHeader
        idInterlocutor={receiverId}
        alternativeIdInterlocutor={alternativeIdInterlocutor}
      />
      <ChatContent sender_id={senderId} date={date} />
      <ChatInput
        socket={socket}
        conversationId={conversation_id}
        sender_id={senderId}
        receiver_id={receiverId}
      />
    </div>
  );
};

export default ChatWindow;
