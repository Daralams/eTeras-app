import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// middleware
import { auth } from "../../middleware/auth.js";
// components
import SecondNavbar from "../../components/SecondNavbar";
import Footer from "../../components/Footer";
import { FaSave } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import JoditEditor from "jodit-react";
import slugger from "slug-pixy";

const CreatePost = () => {
  const editor = useRef(null);
  const [accessToken, setAccessToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageName, setImageName] = useState("");
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    getCategory();
  }, []);

  const getUser = async () => {
    try {
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      setAccessToken(authorization.accessToken);
      setUserId(authorization.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      setCategories(response.data[1].data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleContent = (value) => {
    setContent(value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    setSlug(slugger(e.target.value));
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setImageName(image);
    setPreview(URL.createObjectURL(image));
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("imageName", imageName);
    formData.append("content", content);
    try {
      const savepost = await axios.post(
        "http://localhost:3000/posts",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert(savepost.data.msg);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <>
      <SecondNavbar />
      <div className="flex justify-center">
        <div className="mt-5 mb-5 w-4/5 rounded shadow-md p-4 lg:w-3/5">
          <form onSubmit={createPost}>
            <p className="mb-3 text-center text-red-500 font-bold text-md">
              {msg}
            </p>
            <input
              type="hidden"
              value={userId}
              onChange={(e) => setUserId(e.value.target)}
            />
            <input
              type="text"
              className="p-2 w-full border-b-2 border-indigo-400 mb-3 block"
              placeholder="Title post"
              value={title}
              onChange={handleTitle}
            />
            <input type="hidden" value={slug} onChange={handleTitle} />
            <div className="my-2 p-2 border-[1px] rounded">
              <input type="file" onChange={loadImage} />
              {preview ? (
                <div className="mt-2 overflow-hidden">
                  <img src={preview} alt="preview img" className="rounded" />
                </div>
              ) : (
                ""
              )}
            </div>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={handleContent}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-white border-[1px] border-black rounded w-full mt-3 p-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 mt-3">
              {/* !! nanti klo dh kelar bikin func save ini !! <button className="bg-blue-500 px-5 py-2 flex items-center gap-2 text-white rounded-md font-bold">Save <FaSave/></button> */}
              <button className="bg-indigo-500 px-5 py-2 flex items-center gap-2 text-white rounded-md font-bold">
                Post <IoSend />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreatePost;
