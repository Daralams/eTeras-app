import express from "express";
import {
  getFollowersUserAuthorized,
  getFollowingUserAuthorized,
  follow_unfollow_or_follback,
} from "../../Controllers/FollowersFollowing/FollowersFollowingController.js";

const FollowersFollowingRoute = express.Router();
FollowersFollowingRoute.get(
  "/api/followers/:userId",
  getFollowersUserAuthorized
);
FollowersFollowingRoute.get(
  "/api/following/:userId",
  getFollowingUserAuthorized
);
FollowersFollowingRoute.post("/api/follow", follow_unfollow_or_follback);

export default FollowersFollowingRoute;
