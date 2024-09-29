'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
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

    // Function to close the modal and check if task can be marked as completed
    const closeModal = async () => {
        if (selectedTask) {
            await checkAndUpdateTask(selectedTask.id);
        }
        setIsModalOpen(false);
        setSelectedTask(null); // Reset selected task when modal is closed
    };

    // Function to check if all conflicts and collaborations are resolved
    const checkAndUpdateTask = async (taskId) => {
        try {
            const tasksRef = collection(db, "tasks");
            const q = query(tasksRef, where("id", "==", taskId.toString()));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0]; // Get the first matching document
                const taskData = docData.data(); // Get task data
                const taskDocId = docData.id; // This is the Firestore document ID
    
                // Ensure conflictingTasks and collaborator are handled properly
                const conflictingTasks = taskData.conflictingTasks || [];
                const collaborators = taskData.collaborator || [];
    
                // Check if all conflicts and collaborations are resolved
                const allConflictsResolved = conflictingTasks.every(task => !task.isConflicting);
                const allCollaborationsResolved = collaborators.every(collab => !collab.isConflicting);
    
                // If all conflicts and collaborations are resolved, set isPending to false
                if (allConflictsResolved && allCollaborationsResolved) {
                    const updatedTask = { ...taskData, isPending: false };
                    const taskRef = doc(db, "tasks", taskDocId); // Reference the Firestore document
                    await updateDoc(taskRef, updatedTask);
    
                    // Update the local tasks list to reflect the changes
                    setTasks(prevTasks => prevTasks.map(t => t.id === taskDocId ? { ...t, isPending: false } : t));
                }
            }
        } catch (error) {
            console.error("Error updating task: ", error);
        }
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
                    id={selectedTask.id} // Pass the whole task object to the modal
                />
            )}
        </div>
    );
}

export default PendingTasks;
