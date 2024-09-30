"use client";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { user: "me", text: "Hi!" },
    { user: "them", text: "Hello!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false); // To show typing animation

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { user: "me", text: inputValue }]);
      setInputValue("");

      // Delay for showing the typing animation after 2 seconds
      setTimeout(() => {
        setTyping(true); // Show typing animation

        // Simulate a 2-second delay for the other person's response after typing starts
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "them", text: "Sure!" },
          ]);
          setTyping(false); // Hide typing animation after response
        }, 2000);
      }, 2000); // Delay before typing starts
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full max-w-3xl mx-auto flex flex-col justify-between border bg-white">
        {/* ChatBox */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === "me" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`${
                  msg.user === "me" ? "bg-blue-500 text-white" : "bg-gray-300"
                } p-3 rounded-lg max-w-xs`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing animation */}
          {typing && (
            <div className="flex justify-start mb-2">
              <div className="bg-gray-300 p-3 rounded-lg max-w-xs">
                <div className="animate-pulse">Typing...</div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex p-4 bg-gray-200">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 p-2 rounded-lg border focus:outline-none"
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center"
          >
            <AiOutlineSend />
          </button>
        </div>
      </div>
    </div>
  );
}
