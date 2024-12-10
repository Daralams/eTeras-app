import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import ContactSection from "./ContactSection";
import CategorySection from "./CategorySection";
import Loading from "../../components/Loading";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => setIsLoading(false), 2000);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <HeroSection />
          <ContentSection />
          <ContactSection />
          {/* <CategorySection /> */}
          <Footer />
        </>
      )}
    </>
  );
};

export default LandingPage;
