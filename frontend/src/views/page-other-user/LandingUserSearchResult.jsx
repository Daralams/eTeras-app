import axios from 'axios'
import {useParams} from 'react-router-dom'
import SecondNavbar from '../../components/SecondNavbar'
import AuthorProfile from './AuthorProfile'
import AuthorPosts from './AuthorPosts'

const LandingUserSearchResult = () => {
  const {id} = useParams()
  const {username} = useParams()
  return (
    <>
    <SecondNavbar/>
    <AuthorProfile username={username}/>
    <AuthorPosts id={id}/>
    </>
    )
}

export default LandingUserSearchResult