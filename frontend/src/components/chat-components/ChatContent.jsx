const ChatContent = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-auto bg-green-100 p-1.5 mb-2 inline-block rounded-md">
          <p>ini pesan dari lawan bicara</p>
          <p className="text-sm flex justify-end mt-1.5">18.30</p>
        </div>
        <div className="w-auto bg-green-100 p-1.5 mb-2 inline-block rounded-md">
          <p>Lorem ipsum dolor sit amet sat set sat set sat set</p>
          <p className="text-sm flex justify-end mt-1.5">19.00</p>
        </div>
      </div>
    </div>
    )
}

export default ChatContent