// src/utils/chatService.js

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

// Function to send a message
export async function sendMessage(userId1, userId2, messageText) {
  const conversationId =
    userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  const messagesRef = collection(db, "chats", conversationId, "messages");

  await addDoc(messagesRef, {
    senderId: userId1,
    receiverId: userId2,
    text: messageText,
    timestamp: serverTimestamp(),
  });
}

// Function to fetch messages in real-time
export function fetchMessages(userId1, userId2, setMessages) {
  const conversationId =
    userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  const messagesRef = collection(db, "chats", conversationId, "messages");

  const q = query(messagesRef, orderBy("timestamp"));

  // Real-time listener for new messages
  return onSnapshot(q, (snapshot) => {
    const fetchedMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(fetchedMessages);
  });
}
