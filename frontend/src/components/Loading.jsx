import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-indigo-600" />
    </div>
  );
};

export default Loading;
