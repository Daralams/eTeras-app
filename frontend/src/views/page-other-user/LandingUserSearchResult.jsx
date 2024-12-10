import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//middleware
import { auth } from "../../middleware/auth.js";
import SecondNavbar from "../../components/SecondNavbar";
import AuthorProfile from "./AuthorProfile";
import AuthorPosts from "./AuthorPosts";
import Loading from "../../components/Loading.jsx";
import Footer from "../../components/Footer.jsx";

const LandingUserSearchResult = () => {
  const [userIdIsLoggin, setUserIdIsLoggin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    userIsLoggin();
  }, [userIdIsLoggin]);

  const userIsLoggin = async () => {
    try {
      const userData = await auth();
      setUserIdIsLoggin(userData.userId);
    } catch (error) {
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
            <AuthorProfile userIdIsLoggin={userIdIsLoggin} id={id} />
            <AuthorPosts id={id} />
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default LandingUserSearchResult;
