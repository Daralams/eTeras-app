// This section use for display profile author selected 

const AuthorProfile = ({ username }) => {
  return (
    <div className="mt-6">
     <div className="flex gap-3 justify-center m-2">
       <div className="w-[70px] h-[70px] mt-2 flex justify-center items-center bg-indigo-400 text-white text-lg font-mono font-bold rounded-full border-2 border-fuchsia-400">{username[0]}</div>
       <div className="p-2">
         <h1 className="text-2xl font-bold font-mono mb-2">{username}</h1>
         <p className="text-lg">Backend developer</p>
         <div className="flex gap-3">
           <p>10 Posts</p>
           <p>25k Followers</p>
           <p>5k Following</p>
         </div>
         <div className="mt-3 flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Follow</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Messege</button>
        </div>
       </div>
     </div>
    </div>
    )
}

export default AuthorProfile