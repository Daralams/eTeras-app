import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
// middleware
import { auth } from "../../middleware/auth.js";
// components
import SecondNavbar from "../../components/SecondNavbar";
import Comments from "../../components/Comments";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading.jsx";

const DetailPost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [postDetail, setPostDetail] = useState([]);
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState("");
  const [userNameIsLoggin, setUsernameIsLoggin] = useState("");
  const [token, setToken] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPostBySlug();
  }, []);

  const getPostBySlug = async () => {
    try {
      const authorization = await auth();
      if (!authorization) {
        navigate("/login");
      }
      const response = await axios(`http://localhost:3000/posts/${slug}`, {
        headers: { Authorization: `Bearer ${authorization.accessToken}` },
      });
      setPostDetail(response.data);
      setPost(response.data[0]);
      setUserId(authorization.userId);
      setUsernameIsLoggin(authorization.usernameIsLoggin);
      setToken(authorization.accessToken);
    } catch (error) {
      if (error.response.status == 404) {
        navigate("*");
      }
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SecondNavbar />
          <div className="flex flex-col min-h-screen">
            <div className="h-auto mb-20">
              {postDetail.map((post) => (
                <div className="p-4" key={post.id}>
                  <p className="text-xs sm:text-sm">
                    By-{" "}
                    <Link
                      to={`/search/author/${post.user.id}/${post.user.username}`}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      {post.user.username}{" "}
                    </Link>{" "}
                    in{" "}
                    <span className="bg-indigo-300 text-white font-bold px-2 py-0.5 border border-indigo-600 rounded-xl text-xs sm:text-sm">
                      {post.category.name}
                    </span>
                  </p>
                  <p className="mb-4 text-xs sm:text-sm text-slate">
                    Publish at -{" "}
                    {moment(post.createdAt).format("MMMM dddd YYYY")}
                  </p>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="mb-3 w-full sm:w-4/5 lg:w-3/5 h-auto mx-auto rounded-lg shadow-md"
                  />
                  <h1 className="mb-3 text-lg font-bold">{post.title}</h1>
                  <div
                    className="text-sm sm:text-base leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              ))}
            </div>
            <Comments
              post={post}
              userId={userId}
              userNameIsLoggin={userNameIsLoggin}
              token={token}
            />
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default DetailPost;
