import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../middleware/auth";

const socket = io("http://localhost:3000");
const ChatItem = ({ userIdIsLoggin }) => {
  const [chatItems, setChatItems] = useState([]);
  const [loadRecentChats, setLoadRecentChats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentChatsUserIsLoggin();
    // socket.on("update-recent-chats", (recentChats) => {
    //   setChatItems(recentChats); // Misal, menggunakan state management
    //   console.log("Recent chat dari socket io: ", recentChats);
    // });
    socket.on("get-recent-chats", (recentChats) => {
      // setChatItems(recentChats); // Misal, menggunakan state management
    });
  }, [userIdIsLoggin]);

  const getRecentChatsUserIsLoggin = async () => {
    try {
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      const recentChat = await axios.get(
        `http://localhost:3000/chats/${userIdIsLoggin}`,
        {
          headers: { Authorization: `Bearer ${authorization.accessToken}` },
        }
      );
      if (recentChat.status == 200) {
        setTimeout(() => {
          setLoadRecentChats(false);
          setChatItems(recentChat.data.data);
        }, 1000);
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {loadRecentChats ? (
        <div className="flex justify-center mt-6">
          <div className="loader border-t-4 border-indigo-600 rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : (
        <>
          {chatItems.length == 0 ? (
            <div className="text-center p-6 m-2 rounded mt-4 border">
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                No Messages Yet!
              </h2>
              <p className="text-sm text-gray-500">
                Your inbox is currently empty. Start a conversation and connect
                with your friends.
              </p>
            </div>
          ) : (
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
                        <p className="font-bold font-mono">
                          {item.interlocutor.name}
                        </p>
                        <p className="text-sm">
                          {item.recent_chat.sender_id == userIdIsLoggin
                            ? "You:"
                            : ""}{" "}
                          {item.recent_chat.message.length <= 15
                            ? item.recent_chat.message
                            : item.recent_chat.message
                                .substr(0, 15)
                                .concat("...")}
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
          )}
        </>
      )}
    </div>
  );
};

export default ChatItem;
