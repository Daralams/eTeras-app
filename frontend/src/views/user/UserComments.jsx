import SecondNavbar from '../../components/SecondNavbar'

const UserComments = () => {
  return (
    <>
      <SecondNavbar/>
      <div className="m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="h-auto md:col-span-1 p-4">
            <p className="flex items-center gap-4 text-3xl font-bold font-mono mb-3">Username</p>
            <p className="text-2xl font-bold font-mono mb-2">Your Comments</p>
            <p className="text-md font-semibold font-mono">4 Comments</p>
          </div>
        <div className="col-span-1"></div>
        </div>
     </div>
    </>
    )
}

export default UserComments