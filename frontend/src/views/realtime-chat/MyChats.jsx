// Middleware
import { auth } from '../../middleware/auth.js'
import React, { useState, useEffect } from 'react'
import SecondNavbar from '../../components/SecondNavbar'
import ChatItem from '../../components/chat-components/ChatItem'

const MyChats = () => {
  const [userIdIsLoggin, setUserIdIsLoggin] = useState(null)
  
  useEffect(() => {
    userIsLoggin()
  }, [userIdIsLoggin])
  
  const userIsLoggin = async() => {
    const getUserId = await auth()
    setUserIdIsLoggin(getUserId.userId)
  }
  
  return (
    <>
      <SecondNavbar title="Chats"/>
      <ChatItem userIdIsLoggin={userIdIsLoggin}/>
    </>
    )
}

export default MyChats