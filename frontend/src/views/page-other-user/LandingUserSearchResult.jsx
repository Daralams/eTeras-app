import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
//middleware 
import { auth } from '../../middleware/auth.js'
import SecondNavbar from '../../components/SecondNavbar'
import AuthorProfile from './AuthorProfile'
import AuthorPosts from './AuthorPosts'

const LandingUserSearchResult = () => {
  const [userIdIsLoggin, setUserIdIsLoggin] = useState(null)
  const { id } = useParams()
  
  useEffect(() => {
    userIsLoggin()
  }, [userIdIsLoggin])
  
  const userIsLoggin = async() => {
    const userData = await auth()
    setUserIdIsLoggin(userData.userId)
    console.log(userIdIsLoggin)
  }
  
  return (
    <>
    <SecondNavbar/>
    <AuthorProfile userIdIsLoggin={userIdIsLoggin} id={id}/>
    <AuthorPosts id={id}/>
    </>
    )
}

export default LandingUserSearchResult