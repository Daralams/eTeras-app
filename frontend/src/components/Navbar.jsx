import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
// Icons
import { HiMenuAlt1 } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { BiSolidBookContent } from "react-icons/bi";
import { SiGooglemessages } from "react-icons/si";
import { CiLogin, CiLogout } from "react-icons/ci";
import { BiSearchAlt } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
// Components
import SearchInput from "./SearchInput";

function Navbar() {
  const [isLoggin, setIsLoggin] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchBtnClick, setSearchBtnClick] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    try {
      await axios.get("http://localhost:3000/token");
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggin(false);
      }
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await axios.get("http://localhost:3000/token");
      await axios.delete(`http://localhost:3000/logout`, {
        headers: {
          Cookie: `refreshToken=${refreshToken.data[1].RefreshToken}`,
        },
      });
      setIsLoggin(true);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleSearchBtn = () => {
    setSearchBtnClick(!searchBtnClick);
  };

  return (
    <>
      <div className="p-4 bg-indigo-600">
        <div className="flex justify-between items-center">
          {/* Logo dan Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              className="text-2xl text-white md:hidden"
              onClick={toggleSidebar}
            >
              <HiMenuAlt1 />
            </button>
            <NavLink to="/" className="text-3xl font-bold text-white">
              eTeras
            </NavLink>
          </div>
          {/* Menu untuk layar besar */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggin && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-white ${
                      isActive ? "font-bold border-b-2 border-white" : ""
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/posts"
                  className={({ isActive }) =>
                    `text-white ${
                      isActive ? "font-bold border-b-2 border-white" : ""
                    }`
                  }
                >
                  Posts
                </NavLink>
                <NavLink
                  to="/chats"
                  className={({ isActive }) =>
                    `text-white ${
                      isActive ? "font-bold border-b-2 border-white" : ""
                    }`
                  }
                >
                  Chats
                </NavLink>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded text-white font-bold bg-indigo-400"
                >
                  <CiLogout />
                  Logout
                </button>
              </>
            )}
          </div>
          {/* Icon Search dan GitHub */}
          <div className="flex items-center gap-3">
            {!isLoggin && (
              <div className="hidden md:flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded text-white font-bold border-[1px] border-indigo-400 hover:bg-indigo-400"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded text-white font-bold bg-indigo-400"
                >
                  Register
                </NavLink>
              </div>
            )}
            <button onClick={handleSearchBtn}>
              <BiSearchAlt className="text-3xl text-white" />
            </button>
            <Link to="https://github.com/Daralams" target="_blank">
              <FaGithub className="text-3xl text-white cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar untuk layar kecil */}
      <div
        className={`bg-indigo-600 fixed inset-y-0 left-0 w-3/5 p-4 transition-transform duration-300 md:hidden z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <button className="text-2xl text-white" onClick={toggleSidebar}>
            <CgClose />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {isLoggin ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={toggleSidebar}
                className="text-white flex items-center p-2 gap-4 hover:bg-indigo-500"
              >
                <IoHome /> Dashboard
              </NavLink>
              <NavLink
                to="/posts"
                onClick={toggleSidebar}
                className="text-white flex items-center p-2 gap-4 hover:bg-indigo-500"
              >
                <BiSolidBookContent /> Posts
              </NavLink>
              <NavLink
                to="/chats"
                onClick={toggleSidebar}
                className="text-white flex items-center p-2 gap-4 hover:bg-indigo-500"
              >
                <SiGooglemessages /> Chats
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  toggleSidebar();
                }}
                className="mt-4 flex items-center justify-center gap-2 p-2 rounded text-white font-bold bg-indigo-400"
              >
                <CiLogout /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={toggleSidebar}
                className="mt-4 flex items-center justify-center gap-2 p-2 rounded text-white font-bold border-[1px] border-indigo-400 hover:bg-indigo-400"
              >
                <CiLogin /> Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={toggleSidebar}
                className="flex items-center justify-center gap-2 p-2 rounded text-white font-bold bg-indigo-400"
              >
                <CiLogin /> Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Komponen Pencarian */}
      <SearchInput status={searchBtnClick} />
    </>
  );
}

export default Navbar;
