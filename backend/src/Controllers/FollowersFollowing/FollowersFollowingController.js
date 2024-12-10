import { Sequelize, Op, where } from "sequelize";
import FollowersFollowing from "../../Models/FollowersFollowingModel.js";
import Users from "../../Models/UsersModel.js";

export const getFollowersUserAuthorized = async (req, res) => {
  try {
    const user_id_authorized = req.params.userId;
    const checkUserExists = await Users.findOne({
      where: {
        id: user_id_authorized,
      },
    });
    if (!checkUserExists)
      return res.status(404).json({
        status: "failed",
        messege: `User with id: ${user_id_authorized} not found or not registered!`,
      });

    const followers = await FollowersFollowing.findAll({
      where: {
        [Op.and]: [{ userId: user_id_authorized }, { state_followers: true }],
      },
      include: {
        model: Users,
        as: "followers",
      },
    });
    res.status(200).json({
      status: "success",
      messege: `followers user with id: ${user_id_authorized}`,
      followers_total: followers.length,
      data: followers,
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const getFollowingUserAuthorized = async (req, res) => {
  try {
    const user_id_authorized = req.params.userId;
    const checkUserExists = await Users.findOne({
      where: {
        id: user_id_authorized,
      },
    });
    if (!checkUserExists)
      return res.status(404).json({
        status: "failed",
        messege: `User with id: ${user_id_authorized} not found or not registered!`,
      });

    const following = await FollowersFollowing.findAll({
      where: {
        [Op.and]: [{ userId: user_id_authorized }, { state_following: true }],
      },
      include: {
        model: Users,
        as: "following",
      },
    });
    res.status(200).json({
      status: "success",
      messege: `following user with id: ${user_id_authorized}`,
      following_total: following.length,
      data: following,
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const follow_unfollow_or_follback = async (req, res) => {
  try {
    const { userId_selected, user_id_authorized, action } = req.body;
    if (!action || action.length == 0)
      return res.status(400).json({
        status: "failed",
        messege: "Mandatory field action cannot be empty!",
      });
    if (userId_selected == user_id_authorized)
      return res.status(400).json({
        status: "failed",
        messege: "Users cannot follow their own accounts!",
      });

    if (action == "follback") {
      console.log("> Follback action is running....");
      const checkSelectedUserIdFollowing = await FollowersFollowing.findOne({
        where: {
          [Op.and]: [
            { userId: userId_selected },
            { userId_following: user_id_authorized },
          ],
        },
      });

      if (
        checkSelectedUserIdFollowing &&
        checkSelectedUserIdFollowing.userId_followers == null
      ) {
        await FollowersFollowing.update(
          {
            userId_followers: user_id_authorized,
            state_followers: true,
          },
          { where: { id: checkSelectedUserIdFollowing.id } }
        );
        // Get lagi data dari tabel yang userId = userId_authorized dan userId_following = userId_selected
        const checkSelectedUserIdAuthorized = await FollowersFollowing.findOne({
          where: {
            [Op.and]: [
              { userId: user_id_authorized },
              { userId_followers: userId_selected },
            ],
          },
        });

        if (
          checkSelectedUserIdAuthorized &&
          checkSelectedUserIdAuthorized.userId_following == null
        ) {
          await FollowersFollowing.update(
            {
              userId_following: userId_selected,
              state_following: true,
            },
            { where: { id: checkSelectedUserIdAuthorized.id } }
          );
          return res.status(200).json({
            status: "success",
            messege: `Follback user with id: ${userId_selected} successfully!`,
          });
        } else {
          // cek state_followers: jika ( 0 ->  1 ) / ( 1 -> 0 )
          await FollowersFollowing.update(
            {
              state_following: !checkSelectedUserIdAuthorized.state_following,
            },
            { where: { id: checkSelectedUserIdAuthorized.id } }
          );
          return res.status(200).json({
            status: "success",
            messege: `Follback user with id: ${userId_selected} successfully!`,
          });
        }
      } else {
        // change state_followers user selected
        await FollowersFollowing.update(
          {
            state_followers: !checkSelectedUserIdFollowing.state_followers,
          },
          { where: { id: checkSelectedUserIdFollowing.id } }
        );

        // change state_following user authorized
        const checkStateFollowing = await FollowersFollowing.findOne({
          where: {
            [Op.and]: [
              { userId: user_id_authorized },
              { userId_following: userId_selected },
            ],
          },
        });
        await FollowersFollowing.update(
          {
            state_following: !checkStateFollowing.state_following,
          },
          { where: { id: checkStateFollowing.id } }
        );
        return res.status(200).json({
          status: "success",
          messege: `Follback user with id: ${userId_selected} successfully!`,
        });
      }
    } else if (action == "follow_or_unfollow") {
      console.log("> Follow or Unfollow action is running....");
      const checkSelectedUserIdFollowers = await FollowersFollowing.findOne({
        where: {
          [Op.and]: [
            { userId: userId_selected },
            { userId_followers: user_id_authorized },
          ],
        },
      });
      if (
        checkSelectedUserIdFollowers &&
        checkSelectedUserIdFollowers.state_followers == true
      ) {
        await FollowersFollowing.update(
          {
            state_followers: false,
          },
          { where: { id: checkSelectedUserIdFollowers.id } }
        );
        const checkUserAuthExists = await FollowersFollowing.findOne({
          where: {
            [Op.and]: [
              { userId: user_id_authorized },
              { userId_following: userId_selected },
            ],
          },
        });
        const isFollowing = checkUserAuthExists?.state_following || false;
        await FollowersFollowing.update(
          {
            state_following: !isFollowing,
          },
          { where: { id: checkUserAuthExists.id } }
        );
        return res
          .status(200)
          .json({ status: "success", messege: "Follow or Unfollow success!" });
      } else {
        await FollowersFollowing.update(
          {
            state_followers: true,
          },
          { where: { id: checkSelectedUserIdFollowers.id } }
        );
        const checkUserAuthExists = await FollowersFollowing.findOne({
          where: {
            [Op.and]: [
              { userId: user_id_authorized },
              { userId_following: userId_selected },
            ],
          },
        });
        const isFollowing = checkUserAuthExists?.state_following || false;
        await FollowersFollowing.update(
          {
            state_following: !isFollowing,
          },
          { where: { id: checkUserAuthExists.id } }
        );
        return res
          .status(200)
          .json({ status: "success", messege: "Follow or Unfollow success!" });
      }
    } else {
      console.log(
        "> Create new record FollowersFollowing for user authorized and user selected...."
      );
      try {
        // follow if record not exits
        const userAuthorized = await FollowersFollowing.create({
          userId: user_id_authorized,
          userId_following: userId_selected,
          state_following: true,
        });
        const userFollowedBy_userAuthorized = await FollowersFollowing.create({
          userId: userId_selected,
          userId_followers: user_id_authorized,
          state_followers: true,
        });
        return res.status(201).json({
          status: "success",
          messege: "new record followers and following created successfully!",
        });
      } catch (error) {
        console.error(
          `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
        );
      }
    }
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};
