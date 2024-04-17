import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HeroSection from './HeroSection'
import CategorySection from './CategorySection'
import {Link} from 'react-router-dom'

function LandingPage() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <CategorySection/>
    <Footer/>
    </>
    )
}

export default LandingPage