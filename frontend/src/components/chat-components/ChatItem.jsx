import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const socket = io("http://localhost:3000");
const ChatItem = ({ userIdIsLoggin }) => {
  const [chatItems, setChatItems] = useState([]);

  useEffect(() => {
    getRecentChatsUserIsLoggin();
    // socket.on("update-recent-chats", (recentChats) => {
    //   setChatItems(recentChats); // Misal, menggunakan state management
    //   console.log("Recent chat dari socket io: ", recentChats);
    // });
    socket.on("get-recent-chats", (recentChats) => {
      console.log("Recent chat dari socket io: ", recentChats);
      // setChatItems(recentChats); // Misal, menggunakan state management
    });
  }, [userIdIsLoggin]);

  const getRecentChatsUserIsLoggin = async () => {
    try {
      const recentChat = await axios.get(
        `http://localhost:3000/chats/${userIdIsLoggin}`
      );
      setChatItems(recentChat.data.data);
      console.log("Recent chat: ", recentChat.data.data);
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
            {item.interlocutor.profile_photo ? (
              <img
                src={item.interlocutor.profile_photo}
                className="w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden object-cover"
              />
            ) : (
              <div className="w-[50px] h-[50px] flex justify-center items-center p-2 bg-slate-200 rounded-full">
                {item.interlocutor.name[0]}
              </div>
            )}
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
