'use client'
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Link from 'next/link';
import { app } from '/lib/firebaseConfig';


function PendingProjects() {
    const db = getFirestore(app);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingProjects = async () => {
            try {
                const projectsCollection = collection(db, 'projects');
                const q = query(projectsCollection, where('status', '==', 'Pending'));
                const projectsSnapshot = await getDocs(q);
                const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsList);
            } catch (err) {
                setError('Error fetching projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingProjects();
    }, [db]);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Pending Projects</h1>
            {projects.length > 0 ? (
                <ul className="space-y-4">
                    {projects.map(project => (
                        <li key={project.id} className="bg-white p-4 shadow-md rounded-md">
                            <Link href={`/project/${project.id}`}>
                                <a className="text-xl font-semibold text-blue-600 hover:underline">{project.name}</a>
                            </Link>
                            <p className="text-gray-600 mt-2">Owner: {project.owner}</p>
                            <p className="text-gray-600">Due Date: {new Date(project.dueDate).toLocaleDateString()}</p>
                            <p className="text-gray-600">Status: {project.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending projects available.</p>
            )}
        </div>
    );
}

export default PendingProjects;
