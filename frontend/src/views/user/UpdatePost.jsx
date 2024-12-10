import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { auth } from "../../middleware/auth";
import { useParams } from "react-router-dom";
// components
import SecondNavbar from "../../components/SecondNavbar";
import Footer from "../../components/Footer";
import PopupSuccess from "../../components/popups/PopupSuccess";
import AuthFailed from "../../components/popups/AuthFailed";
import { FaFolderOpen } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import JoditEditor from "jodit-react";
import slugger from "slug-pixy";

const UpdatePost = () => {
  const editor = useRef(null);
  const [isLoadImage, setIsLoadImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageName, setImageName] = useState("");
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [isError, setIsError] = useState("");
  const [successUpdatePost, setSuccessUpdatePost] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");
  const { id } = useParams();

  useEffect(() => {
    getCategories();
    getPostById();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      setCategories(response.data[1].data);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const getPostById = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/post/${id}`);
      setUserId(response.data[0].userId);
      setCategoryId(response.data[0].categoryId);
      setTitle(response.data[0].title);
      setSlug(response.data[0].slug);
      setImageName(response.data[0].imageName);
      setPreview(response.data[0].imageUrl);
      setContent(response.data[0].content);
    } catch (error) {
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    setSlug(slugger(e.target.value));
  };

  const handleContent = (value) => {
    setContent(value);
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setImageName(image);
      setIsLoadImage(true);
      setPreview(URL.createObjectURL(image));
      setTimeout(() => setIsLoadImage(false), 2000);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    const authorization = await auth();
    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("imageName", imageName);
    formData.append("content", content);

    try {
      const saveDataUpdated = await axios.patch(
        `http://localhost:3000/posts/edit/${id}`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${authorization.accessToken}`,
          },
        }
      );
      if (saveDataUpdated.status === 200) {
        setSuccessUpdatePost(true);
        setSuccessPopupTitle("Update Post");
        setSuccessPopupMsg("Post updated successfully!");
      }
    } catch (error) {
      setIsError(error.response.data.msg);
      console.error(`[client error] an error occurred: ${error}`);
    }
  };

  const resetSuccessUpdated = () => setSuccessUpdatePost(false);

  return (
    <>
      <SecondNavbar />
      <div className="flex justify-center">
        <div className="mt-5 mb-5 w-11/12 max-w-2xl rounded shadow-md p-6 bg-white">
          {successUpdatePost && (
            <PopupSuccess
              state={successUpdatePost}
              title={successPopupTitle}
              message={successPopupMsg}
              onClose={resetSuccessUpdated}
            />
          )}
          <form onSubmit={updatePost} className="space-y-4">
            <p className="text-center font-bold text-2xl">Edit Post</p>
            {isError && <AuthFailed error={isError} />}
            <input
              type="text"
              placeholder="Title post"
              value={title}
              onChange={handleTitle}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="hidden" value={slug} onChange={handleTitle} />
            <div className="relative h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
              {isLoadImage ? (
                <div className="absolute flex flex-col items-center">
                  <div className="loader border-t-4 border-blue-700 rounded-full w-10 h-10 animate-spin"></div>
                  <span className="mt-2 text-gray-500">Loading...</span>
                </div>
              ) : preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="absolute w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <label
                    htmlFor="file-upload"
                    className="absolute flex flex-col items-center"
                  >
                    <FaFolderOpen className="text-blue-700 text-4xl" />
                    <span className="block text-gray-400 font-normal">
                      Attach your files here
                    </span>
                  </label>
                </>
              )}
              <input
                type="file"
                onChange={loadImage}
                className="h-full w-full opacity-0 cursor-pointer"
              />
            </div>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={handleContent}
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-5 py-2 rounded shadow-md hover:bg-indigo-600 flex items-center gap-2"
              >
                Edit <IoSend />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdatePost;
