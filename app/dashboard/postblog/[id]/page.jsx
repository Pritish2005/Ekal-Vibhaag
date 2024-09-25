'use client'
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useParams } from 'next/navigation';
import { app } from '../../../../lib/firebaseConfig';

function ViewBlogPost() {
    const { id } = useParams(); // Get the blog post ID from the URL
    const db = getFirestore(app); // Initialize Firestore
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost(docSnap.data());
                } else {
                    setError('No post found.');
                }
            } catch (err) {
                setError('Error fetching post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, db]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-600 mb-4">Posted on: {new Date(post.timestamp).toLocaleString()}</p>
            <div className="text-lg text-gray-800">
                {post.content}
            </div>
        </div>
    );
}

export default ViewBlogPost;
