// This navbar use for navigate from detail page, like detail post, account other author etc and go back to old page.
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";

const SecondNavbar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-indigo-600">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className="text-white text-2xl" onClick={() => navigate(-1)}>
            <IoIosArrowBack />
          </button>
          <p className="font-bold font-mono text-white text-lg">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default SecondNavbar;
