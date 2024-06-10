import ChatBubbles from './ChatBubbles'

const ChatContent = ({ sender_id, date }) => {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatBubbles sender_id={sender_id} date={date}/>
      </div>
    </div>
    )
}

export default ChatContent