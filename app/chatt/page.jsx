// src/pages/chat.js
'use client'
import React from "react";
import ChatComponent from "../../components/chatcomponent";
import { useSession } from "next-auth/react";



const ChatPage = () => {
const { data: session, status } = useSession();
  const userId1 = session?.user?.email; // Replace with actual user ID
  const userId2 = "user_2"; // Replace with actual user ID

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-4">Chat</h1>
      <ChatComponent userId1={userId1} userId2={userId2} />
    </div>
  );
};

export default ChatPage;
