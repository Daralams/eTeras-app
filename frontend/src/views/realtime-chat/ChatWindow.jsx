import ChatHeader from '../../components/chat-components/ChatHeader'
import ChatContent from '../../components/chat-components/ChatContent'
import ChatInput from '../../components/chat-components/ChatInput'

const ChatWindow = () => {
  return (
    <div className="relative h-screen">
      <ChatHeader/>
      <ChatContent/>
      <ChatInput/>
    </div>
    )
}

export default ChatWindow