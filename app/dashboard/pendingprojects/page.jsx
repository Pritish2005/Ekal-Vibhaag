'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from '../../../lib/firebaseConfig.js';
import ConflictModal from '../../../components/ConflictModal'; // Import your modal component

function PendingTasks() {
    const db = getFirestore(app);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null); // To hold the task selected for the modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const tasksCollection = collection(db, 'tasks');
                const q = query(tasksCollection, where('isPending', '==', true));
                const tasksSnapshot = await getDocs(q);
                const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTasks(tasksList);
            } catch (err) {
                setError('Error fetching tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingTasks();
    }, [db]);

    // Function to handle when a task is clicked and show the modal
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null); // Reset selected task when modal is closed
    };

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Pending Tasks</h1>
            {tasks.length > 0 ? (
                <ul className="space-y-4">
                    {tasks.map(task => (
                        <li
                            key={task.id}
                            className="bg-white p-4 shadow-md rounded-md cursor-pointer"
                            onClick={() => handleTaskClick(task)} // Open modal on click
                        >
                            <p className="text-xl font-semibold">{task.taskName}</p>
                            <p className="text-gray-600 mt-2">Description: {task.taskDescription}</p>
                            <p className="text-gray-600">Start Date: {new Date(task.startDate).toLocaleDateString()}</p>
                            <p className="text-gray-600">End Date: {new Date(task.endDate).toLocaleDateString()}</p>
                            <p className="text-gray-600">Status: {task.isPending ? 'Pending' : 'Completed'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending tasks available.</p>
            )}

            {/* Modal component to show task details */}
            {selectedTask && (
                <ConflictModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    latitude={selectedTask.latitude}
                    longitude={selectedTask.longitude}
                    startDate={selectedTask.startDate}
                    endDate={selectedTask.endDate}
                    collaborators={selectedTask.collaborator} // Pass collaborators if any
                />
            )}
        </div>
    );
}

export default PendingTasks;
