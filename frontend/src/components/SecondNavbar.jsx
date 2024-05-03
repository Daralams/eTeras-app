// This navbar use for navigate from detail page, like detail post, account other author etc and go back to old page.
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io"
import { CiMenuKebab } from "react-icons/ci"
import { IoIosNotifications } from "react-icons/io"

const SecondNavbar = () => {
  const navigate = useNavigate()
  
  return (
    <div className="p-4 bg-indigo-600">
      <div className="flex justify-between items-center">
        <button className="text-white text-2xl" onClick={() => navigate(-1)}><IoIosArrowBack/></button>
        <div className="flex gap-3">
          <button className="text-white text-2xl"><IoIosNotifications/></button>
          <button className="text-white text-2xl"><CiMenuKebab/></button>
        </div>
      </div>
    </div>
    )
}

export default SecondNavbar