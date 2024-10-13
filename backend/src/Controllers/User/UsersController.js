import { Sequelize } from "sequelize";
import path from "path";
import fs from "node:fs";
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import Users from "../../Models/UsersModel.js";
import Posts from "../../Models/PostsModel.js";
import Category from "../../Models/CategoryModel.js";
import Likes from "../../Models/LikesModel.js";
import Comments from "../../Models/CommentsModel.js";
import ReplyComment from "../../Models/ReplyCommentModel.js";
import user from "../../Routes/User/UsersRoute.js";

export const dashboard = async (req, res) => {
  try {
    // ini digunakan utk menampilkan semua post berdasarkan user yg login
    res.status(200).json({ msg: "Your dashboard" });
  } catch (error) {
    console.error(error.message);
  }
};

export const accountSettings = async (req, res) => {
  try {
    const usersIsLogin = await Users.findOne({
      where: {
        email: req.params.email,
      },
    });

    if (usersIsLogin) {
      res.status(200).json([{ status: "success" }, { data: usersIsLogin }]);
    } else {
      res
        .status(401)
        .json([
          { status: "failed" },
          { message: `email : ${req.params.email} Unauthorized!` },
        ]);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.userId } });
    if (!user)
      return res.status(404).json({
        status: "failed",
        msg: `User with id ${req.params.id}, not found!`,
      });
    let newUserData = {
      username: req.body.username,
      email: req.body.email,
      about: req.body.about,
      date_of_birth: req.body.date_of_birth,
    };

    if (
      newUserData.username === undefined ||
      newUserData.username === user.username
    ) {
      newUserData.username = user.username;
    }

    if (newUserData.username !== user.username) {
      const usernameTaken = await Users.findOne({
        where: { username: newUserData.username },
      });
      if (newUserData.username.trim().length < 1)
        return res
          .status(400)
          .json({ status: "failed", msg: "username cannot be empty!" });

      if (usernameTaken != null) {
        return res.status(400).json({
          status: "failed",
          msg: `username ${newUserData.username} already use!`,
        });
      }
    }

    if (newUserData.email === undefined || newUserData.email === user.email) {
      newUserData.email = user.email;
    }
    if (newUserData.email !== user.email) {
      const emailTaken = await Users.findOne({
        where: { email: newUserData.email },
      });
      if (!newUserData.email || newUserData.email.trim().length < 1)
        return res
          .status(400)
          .json({ status: "failed", msg: "email cannot be empty!" });
      if (emailTaken != null) {
        return res.status(400).json({
          status: "failed",
          msg: `email ${newUserData.email} already use!`,
        });
      }
    }

    let fileName = "";
    if (req.files === null) {
      fileName = user.profile_photo_name;
    } else {
      const imgFile = req.files.profile_photo_name;
      const imgFileSize = imgFile.size;
      const extension = path.extname(imgFile.name);
      fileName = imgFile.md5 + extension;
      const allowedType = [".jpg", ".jpeg", ".png"];

      if (!allowedType.includes(extension.toLowerCase()))
        return res.status(422).json({
          status: "failed",
          msg: "Invalid file type, file must be .jpg, .jpeg .png for the type!",
        });

      if (imgFileSize > 5_000_000)
        return res
          .status(422)
          .json({ status: "failed", msg: "file size must be less than 5 mb!" });

      const filePath = `./public/images/${user.profile_photo_name}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      imgFile.mv(`public/images/${fileName}`, async (error) => {
        if (error)
          return res.status(500).json({ status: "failed", msg: error.message });
      });
    }
    console.log("file name: ", fileName);
    const imgUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
      const request = await Users.update(
        {
          username: newUserData.username,
          email: newUserData.email,
          about: newUserData.about,
          profile_photo_name: fileName,
          profile_photo_url: imgUrl,
          date_of_birth: newUserData.date_of_birth,
        },
        { where: { id: user.id } }
      );
      res.status(201).json({
        status: "success",
        msg: `profile ${user.username} updated successfully`,
      });
    } catch (error) {
      console.error(error.message);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteUserProfilePhoto = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.userId } });
    if (user.profile_photo_name == null || user.profile_photo_url == null)
      return res.status(400).json({
        status: "failed",
        msg: "failed to delete profile photo, user dont have profile photo",
      });
    else {
      const deletePhoto = await Users.update(
        {
          profile_photo_name: null,
          profile_photo_url: null,
        },
        { where: { id: user.id } }
      );
      const filePath = `./public/images/${user.profile_photo_name}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res
        .status(201)
        .json({ status: "success", msg: "profile photo deleted sucessfully!" });
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const getUserById = async (req, res) => {
  const response = await Users.findOne({
    where: {
      id: req.params.userId,
    },
  });
  if (!response) {
    return res.status(404).json({
      status: "failed",
      msg: "id is not valid!",
    });
  }
  res.status(200).json({
    status: "success",
    msg: `User with id ${req.params.userId} : `,
    data: [response],
  });
};

export const getUser = async (req, res) => {
  try {
    const response = await Users.findAll({
      where: {
        username: req.params.username,
      },
      include: Posts,
      order: [["createdAt", "DESC"]],
    });
    if (response.length === 0) {
      throw new Error(`No post by : ${req.params.username}`);
    }
    res
      .status(200)
      .json([{ msg: `Author : ${req.params.username}` }, { data: response }]);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// show favorite posts user is loggin
export const favoritedPosts = async (req, res) => {
  try {
    const checkUserId = await Users.findOne({
      where: { id: req.params.userId },
    });
    if (!checkUserId) return res.sendStatus(404);
    const getLikesData = await Likes.findAll({
      attributes: ["postId", "userId", "status"],
      where: {
        userId: req.params.userId,
        status: 1,
      },
      include: {
        model: Posts,
        include: [{ model: Users }, { model: Category }],
      },
    });
    res.status(200).json({ data: getLikesData });
  } catch (error) {
    console.log(error.message);
  }
};

// show comments user is loggin
export const commentsHistory = async (req, res) => {
  try {
    const checkUserId = await Users.findOne({
      where: { id: req.params.userId },
    });
    if (!checkUserId) return res.sendStatus(404);

    // const getCommentsHistory = await Comments.findAll({
    //   where: { userId: req.params.userId },
    //   include: [
    //     {model: Posts},
    //     {model: ReplyComment
    //     }]
    // })

    // percobaan
    // problem query ini:
    // 1. Gabisa nampilin comment yg ga memiliki ReplyComment
    const getCommentsHistory = await Posts.findAll({
      attributes: ["id", "title", "slug", "createdAt"],
      include: [
        { model: Users, attributes: ["id", "username"] },
        {
          model: Comments,
          required: true,
          // where: { userId: req.params.userId },
          include: [
            {
              model: ReplyComment,
              where: { userId: req.params.userId },
              include: { model: Users, attributes: ["id", "username"] },
              // required: false
            },
            { model: Users, attributes: ["id", "username"] },
          ],
        },
      ],
    });

    // const getReplyOtherUserHistory = await ReplyComment.findAll({
    //   where: { userId: req.params.userId},
    //   include: [
    //     {model: Comments,
    //     include: { model: Posts }}
    //     ]
    // })

    // if(response.length == 0) {
    //   const replyToOtherUser = await ReplyComment.findAll({ where: {userId: req.params.userId} })
    //   return res.status(200).json({ data : replyToOtherUser })
    // }

    res.status(200).json({ posts: getCommentsHistory });
  } catch (error) {
    console.log(error.message);
  }
};

// get profile other user to see profile other user account
export const getProfileOtherUser = async (req, res) => {
  const request = await Users.findOne({
    attributes: {
      exclude: ["password", "confirmPw", "refresh_token", "updatedAt"],
    },
    where: {
      id: req.params.id,
    },
    include: {
      model: Posts,
      attributes: ["id"],
    },
  });
  res.status(200).json({ userProfile: request });
};
