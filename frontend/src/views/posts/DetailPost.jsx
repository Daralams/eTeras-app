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
      console.error(`[client error] an error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center font-bold text-xl">
          Loading...
        </div>
      ) : (
        <>
          <SecondNavbar />
          <div className="h-auto mb-20">
            {postDetail.map((post) => (
              <div className="p-4" key={post.id}>
                <p className="text-sm">
                  By-{" "}
                  <Link
                    to={`/search/author/${post.user.id}/${post.user.username}`}
                    className="text-blue-300"
                  >
                    {post.user.username}{" "}
                  </Link>{" "}
                  in {post.category.name}
                </p>
                <p className="mb-4 text-sm text-slate">
                  Publish at - {moment(post.createdAt).format("MMMM dddd YYYY")}
                </p>
                <img src={post.imageUrl} alt={post.title} />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ))}
          </div>
          <Comments
            post={post}
            userId={userId}
            userNameIsLoggin={userNameIsLoggin}
            token={token}
          />
          <Footer />
        </>
      )}
    </>
  );
};

export default DetailPost;
