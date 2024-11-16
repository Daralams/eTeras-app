import { Sequelize } from "sequelize";
import ReplyComment from "../../Models/ReplyCommentModel.js";
import Comments from "../../Models/CommentsModel.js";
import Users from "../../Models/UsersModel.js";

export const replyMainComment = async (req, res) => {
  try {
    const validIdComment = await Comments.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!validIdComment) res.sendStatus(404);
    // request body reply comment
    const replyData = {
      commentId: req.params.id,
      userId: req.body.userId,
      referencedUsername: req.body.referenced_username,
      message: req.body.message,
    };

    if (replyData.message.length < 1)
      return res.status(500).json({ msg: "please type a comment!" });
    const validIdUser = await Users.findOne({
      where: {
        id: replyData.userId,
      },
    });
    if (!validIdUser) return res.sendStatus(401);
    const insertReplyComment = await ReplyComment.create({
      commentId: replyData.commentId,
      userId: validIdUser.id,
      parentReplyId: null,
      referenced_username: replyData.referencedUsername,
      message: replyData.message,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const editReplyMainComment = async (req, res) => {
  try {
    const replyId = await ReplyComment.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!replyId) return res.sendStatus(404);
    const messageLength = req.body.message;
    if (messageLength.length < 1)
      return res.status(500).json({ msg: "please type a comment!" });
    const editReply = await ReplyComment.update(req.body, {
      where: {
        id: replyId.id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const deleteReplyMainComment = async (req, res) => {
  const response = await ReplyComment.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!response) return res.sendStatus(404);
  res.sendStatus(200);
};

// replies to replies
export const repliesToReplies = async (req, res) => {
  try {
    const replyId = req.params.id;
    const mainCommentId = req.params.commentId;
    // cek kesesuaian id & commentId params pada data balasan
    const validId = await ReplyComment.findOne({
      where: {
        id: replyId,
        commentId: mainCommentId,
      },
    });

    if (!validId) return res.sendStatus(404);

    const nestedRepliesData = {
      id: validId.id,
      commentId: validId.commentId,
      userId: req.body.userId,
      referencedUsername: req.body.referenced_username,
      message: req.body.message,
    };
    console.log(nestedRepliesData.message);

    const validIdUser = await Users.findOne({
      where: {
        id: nestedRepliesData.userId,
      },
    });
    if (!validIdUser) return res.sendStatus(404);
    if (nestedRepliesData.message.length < 1)
      return res.status(500).json({ msg: "please type a command" });

    const insertRepliesToReplies = await ReplyComment.create({
      commentId: nestedRepliesData.commentId,
      userId: nestedRepliesData.userId,
      parentReplyId: nestedRepliesData.id,
      referenced_username: nestedRepliesData.referencedUsername,
      message: nestedRepliesData.message,
    });
    res.status(201).json({ insertRepliesToReplies });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};
