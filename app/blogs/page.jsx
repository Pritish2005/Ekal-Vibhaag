'use client'
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogPosts);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

        <div className="space-y-8">
          {blogs.length === 0 ? (
            <p>No blog posts found. Please add some!</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">
                  By {blog.author} on {blog.date}
                </p>
                <p className="text-gray-800">{blog.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
