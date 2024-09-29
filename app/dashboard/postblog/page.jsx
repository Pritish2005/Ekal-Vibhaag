// 'use client'
// import React, { useState } from 'react';
// import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firebase
// import { app } from '../../../lib/firebaseConfig'; // Firebase config
// import { useRouter } from 'next/navigation';

// function AddBlogPost() {
//     const db = getFirestore(app); // Initialize Firestore
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             const docRef = await addDoc(collection(db, "posts"), {
//                 title,
//                 content,
//                 timestamp: new Date().toISOString(), // Capture the date and time
//             });

//             console.log("Document written with ID: ", docRef.id);
//             router.push(`/blog/${docRef.id}`); // Redirect to the individual blog post page
//         } catch (error) {
//             console.error("Error adding document: ", error);
//             setError("Error submitting blog post.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <h1 className="text-3xl font-bold mb-6 text-center">Add Blog Post</h1>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Enter Blog Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                     className="p-3 border border-gray-300 rounded-lg"
//                 />
//                 <textarea
//                     placeholder="Enter Blog Content"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     required
//                     className="p-3 border border-gray-300 rounded-lg h-40"
//                 ></textarea>
//                 <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
//                     disabled={loading}
//                 >
//                     {loading ? 'Loading...' : 'Add Post'}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default AddBlogPost;
'use client'

import React, { useState } from "react";

import { collection, addDoc } from "firebase/firestore";
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
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,};

const app = initializeApp(firebaseConfig);

const { data: session, status } = useSession(); // Access session data and status

    if (status === 'loading') {
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

const userDetails =session.user;

const db = getFirestore(app);
const WriteBlog = () => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: userDetails.email,
    department: userDetails.department,
    date: new Date().toLocaleDateString(),
  });

  // Handle input changes
  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Submit the blog post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the blog to Firestore
    await addDoc(collection(db, "blogs"), blog);

    // Reset the form
    setBlog({
      title: "",
      content: "",
      date: new Date().toLocaleDateString(),
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

          <div>
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
