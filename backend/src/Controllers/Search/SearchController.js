import { Sequelize, Op } from "sequelize";
import Posts from "../../Models/PostsModel.js";
import Category from "../../Models/CategoryModel.js";
import Users from "../../Models/UsersModel.js";

// search : posts, category
export const searchPosts = async (req, res) => {
  const searchKey = req.query.key;
  if (!searchKey || searchKey.trim() === " ") {
    return res.status(400).json({ error: "Please provide a search term" });
  }

  const findPostByKey = await Posts.findAndCountAll({
    include: [{ model: Category, attributes: ["name", "slug"] }],
    attributes: ["id", "title", "slug"],
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${searchKey}%` } },
        { "$category.name$": { [Op.like]: `%${searchKey}%` } },
      ],
    },
  });

  if (findPostByKey.count == 0)
    return res.status(404).json({ error: `No result for : ${searchKey}` });
  res.status(200).json({ data: findPostByKey });
};

// search author
export const searchAuthor = async (req, res) => {
  const authorName = req.query.name;
  if (!authorName || authorName.trim() === " ") {
    return res.status(400).json({ error: "Please provide a author name!" });
  }

  const searchAuthorByName = await Users.findAndCountAll({
    attributes: ["id", "username", "profile_photo_url"],
    where: { username: { [Op.like]: `%${authorName}%` } },
  });
  if (searchAuthorByName.count == 0)
    return res.status(404).json({ error: `Author: ${authorName} not found!` });
  res.status(200).json({ data: searchAuthorByName });
};
