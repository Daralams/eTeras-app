import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p class="text-sm md:text-base">
          &copy; 2024{" "}
          <Link
            to="https://www.linkedin.com/in/mangandaralam-sakti/"
            className="font-bold text-indigo-600"
          >
            Mangandaralam Sakti.
          </Link>{" "}
          All rights reserved.
        </p>
        <p class="text-sm md:text-base mt-2 md:mt-0">eTeras v1.0</p>
      </div>
    </footer>
  );
};

export default Footer;
