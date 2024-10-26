import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";

const socket = io("http://localhost:3000");
const ChatItem = ({ userIdIsLoggin }) => {
  const [chatItems, setChatItems] = useState([]);

  useEffect(() => {
    getChatsUserIsLoggin();
    // show recent chats ~ blm bener!
    socket.on("recent-chats", (userIdIsLoggin) => {
      setChatItems((prevChats) => [...prevChats, userIdIsLoggin]);
    });
    console.log(chatItems);
    return () => socket.off("recent-chats");
  }, [userIdIsLoggin]);

  const getChatsUserIsLoggin = async () => {
    try {
      const getRecentChats = await axios.get(
        `http://localhost:3000/chats/${userIdIsLoggin}`
      );
      setChatItems(getRecentChats.data.data);

      // send userIdIsLoggin for get recent chats
      socket.emit("send-userIdIsLoggin", userIdIsLoggin);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-2">
      {chatItems.map((item) => (
        <div className="flex flex-col gap-2" key={item.id}>
          <Link
            to={`/chats/content/${item.interlocutor.id}/${item.id}`}
            className="flex items-center w-full p-2 gap-4 hover:bg-slate-100"
          >
            <div className="w-[50px] h-[50px] flex justify-center items-center p-2 bg-slate-200 rounded-full">
              {item.interlocutor.name[0]}
            </div>
            <div className="w-full flex justify-between py-3">
              <div>
                <p className="font-bold font-mono">{item.interlocutor.name}</p>
                <p className="text-sm">
                  {item.recent_chat.sender_id == userIdIsLoggin ? "You:" : ""}{" "}
                  {item.recent_chat.message.length <= 15
                    ? item.recent_chat.message
                    : item.recent_chat.message.substr(0, 15).concat("...")}
                </p>
              </div>
              <div className="right-0">
                <p className="text-sm font-extralight">
                  {moment(item.date).format("L")}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatItem;
