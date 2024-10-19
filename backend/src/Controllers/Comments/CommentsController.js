import { Sequelize } from "sequelize";
import Posts from "../../Models/PostsModel.js";
import Users from "../../Models/UsersModel.js";
import Comments from "../../Models/CommentsModel.js";
import ReplyComment from "../../Models/ReplyCommentModel.js";

export const getCommentsById = async (req, res) => {
  try {
    const response = await Comments.findAll({
      where: { postId: req.params.postId },
      include: [
        { model: Users },
        { model: ReplyComment, include: { model: Users } },
      ],
    });
    if (!response || response.length < 1) {
      return res.status(404).json({
        status: "failed",
        msg: `Post with id ${req.params.postId} don't have any comment!`,
      });
    }
    res.status(200).json({
      status: "success",
      msg: `Comments and reply comments in post id: ${req.params.postId}: `,
      data: response,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const comments = async (req, res) => {
  try {
    const postId = await Posts.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!postId) return res.status(404).json({ msg: "Post id is invalid!" });

    const checkUser = await Users.findOne({
      where: {
        id: req.body.userId,
      },
    });
    if (!checkUser)
      return res.status(401).json({ msg: "User not registered!" });

    const messageValue = req.body.message;
    if (messageValue.length < 1)
      return res.status(500).json({ msg: "please type a comment!" });

    const insertComment = await Comments.create(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
  }
};

export const editComment = async (req, res) => {
  try {
    const commentId = await Comments.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!commentId)
      return res.status(404).json({ msg: "Comment id is invalid!" });
    const messageValue = req.body.message;
    if (messageValue.length < 1)
      return res.status(500).json({ msg: "please type a comment!" });
    const edit = await Comments.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteComment = async (req, res) => {
  const response = await Comments.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!response) return res.sendStatus(404);
  res.sendStatus(200);
};
