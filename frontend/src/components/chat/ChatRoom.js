import { useState, useEffect, useRef } from "react";
import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";
import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMessagesOfChatRoom(currentChat._id);
      setMessages(res);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [currentChat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setIncomingMessage({
        _id: data._id, // Ensure unique ID is present
        senderId: data.senderId,
        message: data.message,
      });
    });
  }, [socket]);

  useEffect(() => {
    if (incomingMessage && !messages.some(msg => msg._id === incomingMessage._id)) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, messages]);

  const handleFormSubmit = async (message) => {
    const receiverId = currentChat.members.find(
      (member) => member !== currentUser.uid
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser.uid,
      receiverId: receiverId,
      message: message,
    });

    const messageBody = {
      chatRoomId: currentChat._id,
      sender: currentUser.uid,
      message: message,
    };
    const res = await sendMessage(messageBody);
    setMessages([...messages, res]);
  };

  return (
    <div className="lg:col-span-2 lg:block">
      <div className="w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition duration-300 ease-in-out">
        <div className="p-3">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative w-full p-6 overflow-y-auto h-[30rem] bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-all duration-500 ease-in-out">
          <ul className="space-y-2">
            {messages.map((message, index) => (
              <div key={index} ref={scrollRef} className="fade-in">
                <Message message={message} self={currentUser.uid} />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
