import {Link} from 'react-router-dom'

function HeroSection () {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="pt-16 grid place-content-center">
        <div className="text-center p-3">
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-3">Welcome to Our blog</h1>
          <p className="text-white mb-8">Find your knowledge here</p>
          <Link className="text-white text-xl border-2 border-rose-500 rounded py-3 px-5 hover:bg-red-500" to ="/posts">Start now</Link>
        </div>
      </div>
    </div>
    )
}

export default HeroSection