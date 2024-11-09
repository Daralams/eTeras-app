import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const request = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      alert("Login success");
      navigate("/posts");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="m-3 p-4 border-2 rounded shadow-lg md:w-2/5 ">
        <form className="w-full" onSubmit={login}>
          {errorMsg ? (
            <div className="p-3 border-[1px] text-center text-red-500 text-sm border-red-700 rounded-md">
              {errorMsg}
            </div>
          ) : (
            ""
          )}
          <h1 className="text-xl text-center font-bold my-3">Login</h1>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            className="border-2 p-2 w-full d-block mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="border-2 p-2 w-full d-block mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full mt-3 mb-2 px-4 py-2 ${
              (email && password).trim().length < 1
                ? "bg-indigo-200"
                : "bg-indigo-600"
            } text-white rounded-sm hover:bg-indigo-300`}
            disabled={(email && password).trim().length < 1}
          >
            Login
          </button>
          <p className="text-sm text-center text-slate-700">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-indigo-500 font-bold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
