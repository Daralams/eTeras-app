import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatBubbles = ({ sender_id, date }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [alternativeDate, setAlternativeDate] = useState("");
  const { conversation_id } = useParams();

  // alternative date
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[month - 1];

  useEffect(() => {
    setAlternativeDate(moment(`${today} ${monthName} ${year}`).format("LL"));
    getChats();
    socket.on("receive-message", (msg_data) => {
      if (msg_data.conversationId === conversation_id) {
        setChatMessages((prevMessages) => [...prevMessages, msg_data]);
      }
    });

    return () => socket.off("receive-message");
  }, []);

  const getChats = async () => {
    const response = await axios.get(
      `http://localhost:3000/chats/content/${conversation_id}`
    );
    console.log("Chat with id : ", conversation_id, ": ", response);
    setChatMessages(response.data.data.chats);
  };

  return (
    <>
      <div className="flex justify-center items-center mb-3">
        <div className="py-1.5 px-2 rounded bg-indigo-300 text-sm text-slate-100">
          {date ? moment(date).format("LL") : alternativeDate}
        </div>
      </div>
      {chatMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id == sender_id ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`w-auto ${
              message.sender_id == sender_id
                ? "bg-slate-100"
                : "bg-indigo-400 text-slate-50"
            } p-1.5 mb-2 rounded-md`}
          >
            <p>{message.message}</p>
            <p className="text-sm flex justify-end mt-1.5">
              {moment(message.createdAt).format("LT")}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatBubbles;
