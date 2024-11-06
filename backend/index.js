import express, { response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// authentication route
import auth from "./src/Routes/Auth/AuthRoute.js";
// user route
import user from "./src/Routes/User/UsersRoute.js";
// posts route
import PostRouter from "./src/Routes/Posts/PostRoute.js";
import CategoryRouter from "./src/Routes/Posts/CategoryRoute.js";
// comments Routes
import CommentsRouter from "./src/Routes/Comments/CommentsRoute.js";
import ReplyRoutes from "./src/Routes/Comments/RepliesRoute.js";
// like dislike routes
import likeDislikePostRouter from "./src/Routes/Likes/LikesRoute.js";
// search Posts
import searchRoute from "./src/Routes/Search/SearchRoute.js";
// chats
import ChatsRouter from "./src/Routes/Chats/ChatsRoute.js";
import db from "./src/Database/DbConnection.js";
// likes
import { likeDislikePost } from "./src/Controllers/Likes/LikesController.js";
// comments realtime
import {
  getCommentsById,
  comments,
} from "./src/Controllers/Comments/CommentsController.js";
// chats realtime
import {
  showConversationsUserIsLoggin,
  showConversationContentById,
  sendMessage,
} from "./src/Controllers/Chats/ChatsController.js";
// get user by id
import { getUserById } from "./src/Controllers/User/UsersController.js";
import { getPostBySlug } from "./src/Controllers/Posts/PostsController.js";

dotenv.config();
const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
});
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(auth);
app.use(user);
app.use(PostRouter);
app.use(CategoryRouter);
app.use(CommentsRouter);
app.use(ReplyRoutes);
app.use(likeDislikePostRouter);
app.use(searchRoute);
app.use(ChatsRouter);

io.on("connection", (socket) => {
  console.log(`> client connected, socket id: ${socket.id}`);

  // realtime like dislike posts
  socket.on("like-dislike-process", async (posts) => {
    console.log("Likes total: ", posts);
    socket.broadcast.emit("show-recent-like-total", posts);
  });

  // comments realtime
  socket.on("comment-proccess", async (sendComment) => {
    console.log(sendComment);
    await comments(
      { body: sendComment },
      {
        status: (code) => ({ json: (response) => console.log(response) }),
      }
    );
    socket.broadcast.emit("recent-comments", sendComment);
  });

  // recent chats ~ send user id is login for get recent chats ~ blm bener ngaff (kerjain komen dlu)
  // socket.on("send-userIdIsLoggin", async (userIdIsLoggin) => {
  //   console.log("User sedang login id: " + userIdIsLoggin);
  //   await showConversationsUserIsLoggin(userIdIsLoggin);

  //   // show recent chats by user id is login
  //   socket.broadcast.emit("recent-chats", userIdIsLoggin);
  // });

  // chatting
  socket.on("send-message", async (msg_data) => {
    console.log({ msg_data });
    const id_user = msg_data.receiver_id;
    // Call the sendMessage function and pass the message data
    await sendMessage(
      { body: msg_data },
      {
        status: (code) => ({
          json: (response) => {
            console.log(response);
          },
        }),
      }
    );
    socket.broadcast.emit("receive-message", msg_data);

    // RECENT CHAT MASIH BELUM BENAR, ADA BUG DI PENGEMALIAN RESPONSE YANG TIDAK SESUAI DENGAN API CONVERSATION!
    // const getDataReceiver = await getUserById({ params: { userId: id_user } });
    // console.log("Data receiver: ", getDataReceiver);
    socket.broadcast.emit("get-recent-chats", {
      id: msg_data.receiver_id,
    });

    // // Panggil fungsi untuk mendapatkan recent chats
    // const recentChats = await showConversationsUserIsLoggin(
    //   id_user,
    //   // { params: id_user },
    //   {
    //     status: (code) => ({
    //       json: (data) => data,
    //     }),
    //   }
    // );
    // console.log(
    //   "Recent chats terbaru: ",
    //   recentChats,
    //   "Penerima recent chats: ",
    //   id_user
    // );
    // // Kirim recent chats secara realtime ke user terkait
    // socket.broadcast.emit("update-recent-chats", recentChats);
  });

  socket.on("disconnect", () => {
    console.log(`> client disconnected, socket id: ${socket.id}`);
  });
});

export { io };

server.listen(port, () => console.log(`Server running on port ${port}...`));
