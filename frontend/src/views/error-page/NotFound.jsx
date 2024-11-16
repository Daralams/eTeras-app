import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const page = location.pathname;

  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-gray-200 sm:text-7xl md:text-9xl">
          404
        </h1>

        <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-4xl">
          Uh-oh!
        </p>
        <p className="mt-4 text-sm text-gray-500 sm:text-base md:text-lg">
          We can't find your request page{" "}
          <span className="font-semibold">"{page}"</span>.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring sm:px-5 sm:py-3 sm:text-sm"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
