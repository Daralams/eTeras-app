import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState } from "react";
// auth popup components
import AuthSuccess from "../components/popups/AuthSuccess";
import AuthFailed from "../components/popups/AuthFailed";
// congrats username, your account successfully registered!
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [firstMsgSuccess, setFirstMsgSuccess] = useState("");
  const [lastMsgSuccess, setLastMsgSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [nextRoute, setNextRoute] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const register = async (e) => {
    e.preventDefault();
    const removeEmailFormat = email.split("@")[0];
    setUserEmail(removeEmailFormat);
    try {
      const request = await axios.post("http://localhost:3000/register", {
        username,
        email,
        password,
        confirmPw,
      });
      if (request.status == 201) {
        setRegisterSuccess(true);
        setFirstMsgSuccess("Congrats,");
        setLastMsgSuccess("Your account has been successfully registered.");
        setNextRoute("/login");
      }
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
          {registerSuccess ? (
            <AuthSuccess
              userEmail={userEmail}
              firstMsg={firstMsgSuccess}
              lastMsg={lastMsgSuccess}
              nextRoute={nextRoute}
            />
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
          {errorMsg ? <AuthFailed error={errorMsg} /> : ""}
          <button
            type="submit"
            className={`w-full mt-3 mb-2 px-4 py-2 ${
              (username && email && password && confirmPw).trim().length < 1
                ? "bg-indigo-200"
                : "bg-indigo-600"
            } text-white rounded-sm font-bold hover:bg-indigo-300`}
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
