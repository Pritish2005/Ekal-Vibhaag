"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { AiOutlineEdit } from "react-icons/ai";
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

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const { data: session } = useSession(); // Get user session

  // Fetch all blogs from Firestore and order by `createdAt` field in descending order
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogQuery = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      ); // Order by `createdAt`
      const querySnapshot = await getDocs(blogQuery);
      const blogPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogPosts);
    };

    fetchBlogs();
  }, []);

  const handleEdit = (blog) => {
    // Handle edit functionality (navigate to edit page, show modal, etc.)
    alert(`Editing blog with ID: ${blog.id}`);
    // You can add a redirect to an edit page or open a modal here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

        <div className="space-y-8">
          {blogs.length === 0 ? (
            <p>No blog posts found. Please add some!</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-6 shadow-lg rounded-lg relative"
              >
                {/* Blog content */}
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>

                {/* Author and date information at top-right */}
                <div className="text-gray-600 text-right mb-4">
                  <span>By {blog.author}</span>
                  <br />
                  <span>
                    {new Date(blog.createdAt?.toDate()).toLocaleDateString()}
                  </span>{" "}
                  {/* Convert Firestore Timestamp to readable date */}
                </div>

                <p className="text-gray-600 mb-4">
                  <strong>Department:</strong> {blog.department || "Unknown"}
                </p>
                <p className="text-gray-800 mb-6">{blog.content}</p>

                {/* Only show Edit button if user's department matches the blog's department */}
                {session && session.user.department === blog.department && (
                  <div className="flex justify-end">
                    {/* <button
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
                      onClick={() => handleEdit(blog)}
                      aria-label="Edit"
                    >
                      <AiOutlineEdit size={20} />
                    </button> */}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
