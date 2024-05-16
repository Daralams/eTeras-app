import { Link } from 'react-router-dom'
const ChatItem = () => {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-2">
        <Link to="/chats/id-obrolan" className="flex items-center w-full p-2 flex gap-4 hover:bg-slate-100">
          <div className="w-[50px] h-[50px] flex justify-center items-center p-2 bg-slate-200 rounded-full">Y</div>
          <div className="w-full flex justify-between py-3">
          <div>
            <p className="font-bold font-mono">Yayan</p>
            <p className="text-sm">You: Jadi ga wir?</p>
          </div>
          <div className="right-0">
            <p className="text-sm font-extralight">2 days ago</p>
            {/* <div className="mt-1 5 flex justify-end">
              <p className="flex items-center justify-center right-0 w-[15px] h-[15px] p-3 text-[10px] text-white font-bold bg-indigo-600 rounded-full">2</p>
            </div> */}
          </div>
        </div>
      </Link>
        <Link to="/chats/id-obrolan" className="flex items-center w-full p-2 flex gap-4 hover:bg-slate-100">
          <div className="w-[50px] h-[50px] flex justify-center items-center p-2 bg-slate-200 rounded-full">V</div>
          <div className="w-full flex justify-between py-3">
          <div>
            <p className="font-bold font-mono">Vanda margraf</p>
            <p className="text-sm">Vanda: Good morning ma bro🙏</p>
          </div>
          <div className="right-0">
            <p className="text-sm font-extralight">3 days ago</p>
            <div className="mt-1.5 flex justify-end">
              <p className="flex items-center justify-center right-0 w-[15px] h-[15px] p-3 text-[10px] text-white font-bold bg-indigo-600 rounded-full">2</p>
            </div>
          </div>
        </div>
      </Link>
      </div>
    </div>
    )
}

export default ChatItem