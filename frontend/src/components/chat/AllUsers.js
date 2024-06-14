import { useState, useEffect } from "react";
import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
import UserLayout from "../layouts/UserLayout";
import { motion } from "framer-motion";

export default function AllUsers({
  users,
  chatRooms,
  setChatRooms,
  onlineUsersId,
  currentUser,
  changeChat,
}) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshUsers();
    }, 2000);
    return () => clearInterval(interval);
  }, [chatRooms, currentUser.uid]);

  useEffect(() => {
    const Ids = chatRooms.flatMap(chatRoom =>
      chatRoom.members.filter(member => member !== currentUser.uid)
    );
    setContactIds(Ids);
  }, [chatRooms, currentUser.uid]);

  useEffect(() => {
    refreshUsers();
  }, [contactIds, users, currentUser.uid]);

  const refreshUsers = () => {
    setLoading(true);
    const filteredNonContacts = users.filter(
      (user) => user.uid !== currentUser.uid && !contactIds.includes(user.uid)
    );
    setNonContacts(filteredNonContacts);
    setLoading(false);
  };

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  const handleNewChatRoom = async (user) => {
    const members = {
      senderId: currentUser.uid,
      receiverId: user.uid,
    };
    const res = await createChatRoom(members);
    setChatRooms((prev) => [...prev, res]);
    changeChat(res);
  };

  // Remove duplicate chat rooms based on their members
  const uniqueChatRooms = Array.from(new Set(chatRooms.map(chatRoom => JSON.stringify(chatRoom))))
    .map(json => JSON.parse(json));

  return (
    <div className="text-white">
      <div className="flex flex-col gap-4 p-4">
        <div>
          <h2 className="text-2xl font-semibold dark:text-white">Chats</h2>
          {uniqueChatRooms.map((chatRoom, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <Contact
                chatRoom={chatRoom}
                onlineUsersId={onlineUsersId}
                currentUser={currentUser}
              />
            </motion.div>
          ))}
        </div>
        <div>
          <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">
            Other Users
          </h2>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            nonContacts.map((nonContact, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNewChatRoom(nonContact)}
              >
                <UserLayout
                  user={nonContact}
                  onlineUsersId={onlineUsersId}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
