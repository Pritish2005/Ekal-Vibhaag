// src/components/ChatComponent.js
'use client'
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ChatComponent = ({ userId1, userId2 }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages in real-time
  useEffect(() => {
    const conversationId =
      userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    const messagesRef = collection(db, "chats", conversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [userId1, userId2]);

  // Function to send a message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const conversationId =
        userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
      const messagesRef = collection(db, "chats", conversationId, "messages");

      await addDoc(messagesRef, {
        senderId: userId1,
        receiverId: userId2,
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="chat-container flex flex-col space-y-4">
      <div className="messages-container h-80 overflow-y-scroll bg-gray-100 p-4 rounded-lg shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === userId1 ? "text-right" : "text-left"
            } py-1`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.senderId === userId1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="send-message-container flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
