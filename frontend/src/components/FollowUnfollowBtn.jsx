import axios from "axios";
import React, { useState } from "react";

const FollowUnfollowBtn = ({
  userId_selected,
  user_id_authorized,
  action,
  btn_display_state,
  refresh_data_updated,
}) => {
  const follow_unfollow_or_follback = async () => {
    try {
      const action_request = await axios.post(
        `http://localhost:3000/api/follow`,
        {
          userId_selected,
          user_id_authorized,
          action,
        }
      );
      if (action_request.status == 200) {
        refresh_data_updated();
      }
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={follow_unfollow_or_follback}
    >
      {btn_display_state}
    </button>
  );
};

export default FollowUnfollowBtn;
