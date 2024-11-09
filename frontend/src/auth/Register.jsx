import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      const request = await axios.post("http://localhost:3000/register", {
        username,
        email,
        password,
        confirmPw,
      });

      alert(request.data.msg);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="m-3 p-4 rounded shadow-lg md:w-2/5 border-2">
        <form className="w-full" onSubmit={register}>
          {errorMsg ? (
            <div className="p-3 border-[1px] text-center text-red-500 text-sm border-red-700 rounded-md">
              {errorMsg}
            </div>
          ) : (
            ""
          )}
          <h1 className="text-xl text-center font-bold my-3">Register</h1>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="border-2 p-2 w-full d-block mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="border-2 p-2 w-full d-block mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="border-2 p-2 w-full d-block mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            className="border-2 p-2 w-full d-block mb-3"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full mt-3 mb-2 px-4 py-2 ${
              (username && email && password && confirmPw).trim().length < 1
                ? "bg-indigo-200"
                : "bg-indigo-600"
            } text-white rounded-sm hover:bg-indigo-300`}
            disabled={
              (username && email && password && confirmPw).trim().length < 1
            }
          >
            Register
          </button>
          <p className="text-sm text-center text-slate-700">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-500 font-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
