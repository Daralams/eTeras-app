import { Sequelize, Op } from "sequelize";
import fs from "node:fs";
import path from "path";
import Posts from "../../Models/PostsModel.js";
import Users from "../../Models/UsersModel.js";
import Category from "../../Models/CategoryModel.js";
import Likes from "../../Models/LikesModel.js";
import Comments from "../../Models/CommentsModel.js";
import ReplyComment from "../../Models/ReplyCommentModel.js";

export const getPost = async (req, res) => {
  try {
    const response = await Posts.findAll();
    if (response.length === 0) {
      res.status(404).json({ error: "No post available!" });
    }
    res.status(200).json({ data: response });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const getPostById = async (req, res) => {
  try {
    const response = await Posts.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response)
      return res
        .status(404)
        .json({ msg: `Post with id : ${req.params.id} not found!` });
    res.status(200).json([response]);
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

// get posts data by user id
export const getPostsByUserId = async (req, res) => {
  try {
    const validUserId = await Users.findOne({
      attributes: ["id"],
      where: {
        id: req.params.id,
      },
    });

    if (!validUserId)
      return res
        .status(404)
        .json({ msg: `Can't find user with id ${req.params.id}` });

    const request = await Posts.findAll({
      include: [{ model: Users }, { model: Category }, { model: Likes }],
      where: {
        userId: validUserId.id,
      },
    });

    if (request.length == 0)
      return res
        .status(404)
        .json({ msg: `User id ${validUserId.id} has no posts yet` });
    res.status(200).json({ data: request });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

// get posts based on most likes
export const mostLikePosts = async (req, res) => {
  Posts.findAll({
    attributes: [
      "id",
      "title",
      "slug",
      "createdAt",
      [Sequelize.fn("COUNT", Sequelize.col("likes.postId")), "total_likes"],
    ],
    include: [
      {
        model: Likes,
        where: {
          status: 1,
        },
      },
      {
        model: Category,
        attributes: ["name"],
      },
      {
        model: Users,
        attributes: ["username"],
      },
    ],
    group: ["posts.id"],
    order: [[Sequelize.literal("total_likes"), "DESC"]],
    where: {
      userId: req.params.id,
    },
  })
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((error) => {
      console.error(
        `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
      );
    });
};

// get all data and join with other table
export const getPosts = async (req, res) => {
  try {
    const response = await Posts.findAll({
      attributes: { exclude: ["content"] },
      include: [
        { model: Users, attributes: ["id", "username", "profile_photo_url"] },
        { model: Category, attributes: ["id", "name", "slug"] },
        {
          model: Likes,
          where: {
            status: 1,
          },
          required: false,
        },
        {
          model: Comments,
          include: { model: ReplyComment },
          include: { model: Users },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (response.length == 0) {
      return res.status(200).json({
        status: "failed",
        msg: "no posts available!",
      });
    }
    res.status(200).json({
      status: "success",
      msg: "All post:",
      data: response,
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
    res.status(500).json({
      status: "failed",
      msg: error.message,
    });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const response = await Posts.findOne({
      where: {
        slug: req.params.slug,
      },
      include: [
        { model: Users, attributes: ["id", "username", "email"] },
        { model: Category, attributes: ["id", "name", "slug"] },
        {
          model: Comments,
          include: [
            { model: Users },
            { model: ReplyComment, include: { model: Users } },
          ],
        },
      ],
    });

    if (!response) {
      res
        .status(404)
        .json({ error: `your request : ${req.params.slug}, Not found!` });
    }
    res.status(200).json([response]);
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { categoryId, userId, title, slug, content } = req.body;
    if (req.files === null)
      return res.status(400).json({
        status: "failed",
        msg: "no file uploaded!",
      });
    const imgFile = req.files.imageName;
    const imgFileSize = imgFile.size;
    const extension = path.extname(imgFile.name);
    const fileName = imgFile.md5 + extension;
    const imgUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    // post validation
    if (!title || title.trim().length < 1)
      return res.status(400).json({
        status: "failed",
        msg: "title cannot be empty!",
      });

    if (!categoryId || categoryId === null)
      return res.status(400).json({
        status: "failed",
        msg: "please select category!",
      });

    if (!content || content.trim().length <= 10)
      return res.status(400).json({
        status: "failed",
        msg: "content must be more than 10 characters!",
      });

    // images validation
    if (!allowedType.includes(extension.toLowerCase()))
      return res.status(422).json({
        status: "failed",
        msg: "invalid image type, image must .png .jpg .jpg for the type!",
      });

    if (imgFileSize > 5_000_000)
      return res.status(422).json({
        status: "failed",
        msg: "image size must be less than 5 MB!",
      });

    imgFile.mv(`public/images/${fileName}`, async (error) => {
      if (error)
        return res.status(500).json({
          status: "failed",
          msg: error.message,
        });
      try {
        const request = await Posts.create({
          categoryId,
          userId,
          title,
          slug,
          imageName: fileName,
          imageUrl: imgUrl,
          content,
        });
        const postDataCreated = [request];
        res.status(201).json({
          status: "success",
          msg: "new post created successfully",
          data: postDataCreated.map((post) => ({
            id: post.id,
            title: post.title,
            date: post.createdAt,
          })),
        });
      } catch (error) {
        console.error(
          `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
        );
      }
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const editPost = async (req, res) => {
  try {
    const post_id = req.params.id;
    if (!post_id)
      return res.status(404).json({
        status: "failed",
        msg: "id parameter missing!",
      });
    const post = await Posts.findOne({
      where: { id: post_id },
    });

    if (!post)
      return res.status(404).json({
        status: "failed",
        msg: "post not found!",
      });

    let { categoryId, userId, title, slug, content } = req.body;
    if (title === undefined) {
      title = post.title;
    }
    if (categoryId === undefined) {
      categoryId = post.categoryId;
    }
    // post validation
    if (!title || title.trim().length < 1)
      return res.status(400).json({
        status: "failed",
        msg: "title cannot be empty!",
      });

    if (!categoryId || categoryId == null)
      return res.status(400).json({
        status: "failed",
        msg: "please select category!",
      });

    if (!content || content.trim().length <= 10)
      return res.status(400).json({
        status: "failed",
        msg: "content must be more than 10 characters!",
      });
    // cek user mengganti img atau tdk
    let fileName = "";
    // jika user tdk ganti img
    if (req.files === null) {
      // isi nama file dengan file lama
      fileName = post.imageName;
    } else {
      // jika user ganti img
      const imgFile = req.files.imageName;
      const imgFileSize = imgFile.size;
      const extension = path.extname(imgFile.name);
      fileName = imgFile.md5 + extension;
      const allowedType = [".png", ".jpg", ".jpeg"];

      // images validation
      if (!allowedType.includes(extension.toLowerCase()))
        return res.status(422).json({
          status: "failed",
          msg: "invalid image type, image must .png .jpg .jpg for the type!",
        });

      if (imgFileSize > 5_000_000)
        return res.status(422).json({
          status: "failed",
          msg: "image size must be less than 5 MB!",
        });
      // hapus img lama,
      const filePath = `./public/images/${post.imageName}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // ganti img baru
      imgFile.mv(`public/images/${fileName}`, async (error) => {
        if (error)
          return res.status(500).json({
            status: "failed",
            msg: error.message,
          });
      });
    }
    const imgUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    // update post
    const updatePost = await Posts.update(
      {
        categoryId,
        userId,
        title,
        slug,
        imageName: fileName,
        imageUrl: imgUrl,
        content,
      },
      { where: { id: post_id } }
    );

    res.status(200).json({
      status: "success",
      msg: "post updated successfully",
      data: {
        id: post_id,
        title: req.body.title,
      },
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Posts.findOne({ where: { id: req.params.id } });

    if (!post)
      return res.status(404).json({
        status: "failed",
        msg: `Your request ${req.params.id} Not Found`,
      });

    const filePath = `./public/images/${post.imageName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const deletePost = await Posts.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "success",
      msg: "Your post has been deleted",
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};
