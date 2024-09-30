"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { useSession } from "next-auth/react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WriteBlog = () => {
  const { data: session, status } = useSession(); // Always use hooks at the top level

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: session?.user?.email || "",
    department: session?.user?.department || "",
  });

  // Return loading or login screen before rendering the form
  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading message while checking session
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold">Please Login</h1>
        <p className="mt-4">You need to be logged in to view this page.</p>
      </div>
    );
  }

  // Handle input changes
  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Submit the blog post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the blog to Firestore with server timestamp
    await addDoc(collection(db, "blogs"), {
      ...blog,
      createdAt: serverTimestamp(), // Add the createdAt timestamp
    });

    // Reset the form
    setBlog({
      title: "",
      content: "",
      author: session.user.email, // Reset with author from session
      department: session.user.department, // Reset with department from session
    });

    alert("Blog post added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-6">Write a New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Blog Title</label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleChange}
              placeholder="Enter the blog title"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Blog Content</label>
            <textarea
              name="content"
              value={blog.content}
              onChange={handleChange}
              placeholder="Write your blog content"
              className="w-full p-3 border border-gray-300 rounded-lg h-48"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
