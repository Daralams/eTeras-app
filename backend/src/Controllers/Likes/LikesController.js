import { Sequelize } from "sequelize";
import Likes from "../../Models/LikesModel.js";

export const getLikes = async (req, res) => {
  const results = await Likes.findAll();
  const statusTrue = results.filter((result) => result.status == true);
  res.status(200).json({ statusTrue });
};

export const likeDislikePost = async (req, res) => {
  try {
    /* select postId from likes where userId = req.body.userId and postId = req.body.postId -> menghasilkan 1 nilai postingan jika ada */
    const findPostId = await Likes.findOne({
      attributes: ["id", "postId"],
      where: {
        userId: req.body.userId,
        postId: req.body.postId,
      },
    });

    // jika gaada
    if (!findPostId) {
      return Likes.create({
        postId: req.body.postId,
        userId: req.body.userId,
        status: "1",
      }).then(res.sendStatus(201));
    }
    //jika ada checkStatus, nilainya 0 atau 1?
    const checkStatus = await Likes.findOne({
      attributes: ["status"],
      where: {
        id: findPostId.id,
      },
    });
    if (checkStatus.status == 0) {
      return Likes.update(
        {
          postId: req.body.postId,
          userId: req.body.userId,
          status: "1",
        },
        {
          where: { id: findPostId.id },
        }
      ).then(res.sendStatus(200));
    } else if (checkStatus.status == 1) {
      return Likes.update(
        {
          postId: req.body.postId,
          userId: req.body.userId,
          status: "0",
        },
        {
          where: { id: findPostId.id },
        }
      ).then(res.sendStatus(200));
    }
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};
