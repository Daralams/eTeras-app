import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LuSendHorizonal } from "react-icons/lu"

const ChatInput = ({ socket, conversationId, sender_id, receiver_id }) => {
  const [message, setMessage] = useState("")
  const { userId: idInterlocutor } = useParams()
  
  useEffect(() => {
  }, [])
  
  const submitMessage = (e) => {
    e.preventDefault()
    setMessage("")
    
    const userIdReceiver = receiver_id ? receiver_id : idInterlocutor
    const msg_data = {
      conversationId,
      sender_id,
      receiver_id: userIdReceiver,
      message
    }
    
    socket.emit('send-message', msg_data)
  }
  
  return (
    <div className="bg-white px-2 py-2 sticky bottom-0 z-10 w-full">
      <form className="flex gap-1.5" onSubmit={submitMessage}>
        <input type="hidden" value={idInterlocutor}/>
        <input className="w-full px-4 py-2 border-[1px] rounded-md" placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}/>
        <button className={`${message.trim().length < 1 ? 'bg-indigo-200' : 'bg-indigo-600'} px-4 py-2 text-white rounded-md`} disabled={message.trim().length < 1}><LuSendHorizonal/></button>
      </form>
    </div>
    )
}

export default ChatInput