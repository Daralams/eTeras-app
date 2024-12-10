import { Link } from "react-router-dom";
import hero from "../../../public/assets/hero-section.png";

const HeroSection = () => {
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="flex justify-center items-center w-full h-full">
        <div className="text-center p-6 md:p-12 w-4/5 md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            "Make Every Moment Count, Find It{" "}
            <span className="text-indigo-600">All Here.</span>"
          </h1>
          <p className="text-sm md:text-lg text-slate-900 mb-8">
            Every connection matters, every story deserves to be shared. With
            our platform, you can explore endless possibilities, connect with
            like-minded people, and turn ordinary moments into extraordinary
            memories. Let’s make every second meaningful together!
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link
              className="text-white text-sm md:text-lg font-bold bg-indigo-600 rounded-3xl py-3 px-6 hover:bg-indigo-700 transition duration-300 w-full sm:w-auto"
              to="/posts"
            >
              start now
            </Link>
            <Link
              className="text-white text-sm md:text-lg font-bold bg-slate-950 rounded-3xl py-3 px-6 hover:bg-slate-700 transition duration-300 w-full sm:w-auto"
              to="/"
            >
              contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
