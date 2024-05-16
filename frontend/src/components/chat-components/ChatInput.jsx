import React, { useState } from 'react'
import { LuSendHorizonal } from "react-icons/lu"

const ChatInput = () => {
  const [message, setMessage] = useState("")
  
  return (
    <div className="bg-white px-2 py-2 sticky bottom-0 z-10 w-full">
      <form className="flex gap-1.5">
        <input className="w-full px-4 py-2 border-[1px] rounded-md" placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}/>
        <button className={`${message.length < 1 ? 'bg-indigo-200' : 'bg-indigo-600'} px-4 py-2 text-white rounded-md`} disabled={message.length < 1}><LuSendHorizonal/></button>
      </form>
    </div>
    )
}

export default ChatInput