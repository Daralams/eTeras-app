import express from "express";
import {
  getPost,
  getPosts,
  getPostById,
  getPostsByUserId,
  mostLikePosts,
  getPostBySlug,
  createNewPost,
  editPost,
  deletePost,
} from "../../Controllers/Posts/PostsController.js";
import { verifyToken } from "../../Middleware/verifyToken.js";

const PostRouter = express.Router();
PostRouter.get("/post", getPost);
PostRouter.get("/posts", verifyToken, getPosts);
PostRouter.get("/post/:id", getPostById);
PostRouter.get("/post/userId/:id", verifyToken, getPostsByUserId);
PostRouter.get("/post/userId/:id/mostLike", mostLikePosts);
PostRouter.get("/posts/:slug", verifyToken, getPostBySlug);
PostRouter.post("/posts/", verifyToken, createNewPost);
PostRouter.patch("/posts/edit/:id", verifyToken, editPost);
PostRouter.delete("/post/:id", deletePost);

export default PostRouter;
