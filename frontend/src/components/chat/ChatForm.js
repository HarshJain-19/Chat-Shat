import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import Picker from "emoji-picker-react";

export default function ChatForm({ handleFormSubmit }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [showEmojiPicker]);

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFormSubmit(message);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div ref={scrollRef} className="animate-slideUp">
      {showEmojiPicker && (
        <Picker
          className="dark:bg-gray-900 animate-fadeIn"
          onEmojiClick={handleEmojiClick}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full p-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowEmojiPicker((prev) => !prev);
            }}
            className="focus:outline-none"
          >
            <EmojiHappyIcon
              className="h-7 w-7 text-blue-600 dark:text-blue-500 transition-transform transform hover:scale-110"
              aria-hidden="true"
            />
          </button>
          <input
            type="text"
            placeholder="Write a message"
            className="flex-grow block py-2 px-4 mx-3 outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-300"
            name="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="submit" className="focus:outline-none">
            <PaperAirplaneIcon
              className="h-6 w-6 text-blue-600 dark:text-blue-500 rotate-[90deg] transition-transform transform hover:scale-110"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
