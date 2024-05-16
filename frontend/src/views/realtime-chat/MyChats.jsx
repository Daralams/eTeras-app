// Middleware
import { auth } from '../../middleware/auth.js'
import React, { useEffect } from 'react'
import SecondNavbar from '../../components/SecondNavbar'
import ChatItem from '../../components/chat-components/ChatItem'
const MyChats = () => {
  useEffect(() => {
    getAllChat()
  }, [])
  
  const getAllChat = async() => {
    const getToken = await auth()
  }
  
  return (
    <>
      <SecondNavbar title="Chats"/>
      <ChatItem/>
    </>
    )
}

export default MyChats