'use client'
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firebase
import { app } from '../../../lib/firebaseConfig'; // Firebase config
import { useRouter } from 'next/navigation';

function AddBlogPost() {
    const db = getFirestore(app); // Initialize Firestore
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                title,
                content,
                timestamp: new Date().toISOString(), // Capture the date and time
            });

            console.log("Document written with ID: ", docRef.id);
            router.push(`/blog/${docRef.id}`); // Redirect to the individual blog post page
        } catch (error) {
            console.error("Error adding document: ", error);
            setError("Error submitting blog post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Add Blog Post</h1>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <textarea
                    placeholder="Enter Blog Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded-lg h-40"
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Add Post'}
                </button>
            </form>
        </div>
    );
}

export default AddBlogPost;
