import React from "react";
import { Link } from "react-router-dom";

const AuthSuccess = ({ userEmail, firstMsg, lastMsg, nextRoute }) => {
  return (
    <>
      <style>
        {`
          @keyframes slide-down {
            0% {
              transform: translateY(-50px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-down {
            animation: slide-down 0.4s ease-out;
          }
        `}
      </style>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl m-6 animate-slide-down">
          <section className="rounded-3xl shadow-2xl bg-white">
            <div className="p-8 text-center sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-500">
                {nextRoute == "/login" ? "Register Success" : "Login Success"}
              </p>

              <h2 className="mt-6 text-2xl font-bold">
                {firstMsg} <span className="text-indigo-600">{userEmail}!</span>{" "}
                {lastMsg}
              </h2>

              <Link
                className="mt-8 inline-block w-full rounded-full bg-indigo-600 py-4 text-md font-bold text-white shadow-xl"
                to={nextRoute}
              >
                {nextRoute == "/login" ? "Login" : "Start now"}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AuthSuccess;
