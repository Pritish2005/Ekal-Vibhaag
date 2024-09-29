'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection, where, query } from "firebase/firestore";
import { app } from '../lib/firebaseConfig.js';
import { MdReportProblem } from "react-icons/md";

// Full list of departments
const departments = [
    "Department for Promotion of Industry and Internal Trade",
    "Department of Administrative Reforms and Public Grievances (DARPG)",
    "Department of Agricultural Research and Education (DARE)",
    "Department of Agriculture and Farmers Welfare",
    "Department of Animal Husbandry and Dairying",
    "Department of Biotechnology",
    "Department of Border Management",
    "Department of Chemicals and Petrochemicals",
    "Department of Commerce",
    "Department of Consumer Affairs",
    "Department of Defence",
    "Department of Defence Production",
    "Department of Defence Research and Development",
    "Department of Drinking Water and Sanitation",
    "Department of Economic Affairs",
    "Department of Empowerment of Persons with Disabilities",
    "Department of Ex-Servicemen Welfare",
    "Department of Expenditure",
    "Department of Fertilizers",
    "Department of Financial Services",
    "Department of Fisheries",
    "Department of Food and Public Distribution",
    "Department of Health Research",
    "Department of Health and Family Welfare",
    "Department of Higher Education",
    "Department of Military Affairs (DMA)",
    "Department of Official Language",
    "Department of Pension & Pensioner's Welfare",
    "Department of Personnel and Training",
    "Department of Pharmaceuticals",
    "Department of Home",
    "Department of Investment and Public Asset Management",
    "Department of Justice",
    "Department of Land Resources (DLR)",
    "Department of Legal Affairs",
    "Department of Posts",
    "Department of Public Enterprises",
    "Department of Revenue",
    "Department of Rural Development",
    "Department of School Education and Literacy",
    "Department of Science and Technology",
    "Department of Scientific and Industrial Research",
    "Department of Social Justice and Empowerment",
    "Department of Sports",
    "Department of Telecommunications",
    "Department of Water Resources, River Development and Ganga Rejuvenation",
    "Department of Youth Affairs",
    "Legislative Department"
];

const ConflictModal = ({ id, isOpen, onClose }) => {
    const [conflictingTasks, setConflictingTasks] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        if (isOpen) {
            fetchConflictingTasks();
        }
    }, [isOpen]);

    const fetchConflictingTasks = async () => {
        setLoading(true);
        try {
            if (!id) {
                console.error('No task ID provided.');
                return;
            }

            const tasksRef = collection(db, "tasks");
            const q = query(tasksRef, where("id", "==", id.toString()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                setTaskData(docData);
                setConflictingTasks(docData.conflictingTasks || []);
                setCollaborators(docData.collaborator || []);
            } else {
                console.log("No tasks found with the given ID.");
            }
        } catch (error) {
            console.error("Error fetching conflicting tasks: ", error);
        } finally {
            setLoading(false);
        }
    };

    const suggestedTasks = conflictingTasks; 
    const collabTasks = collaborators;

    const collaboratorDepartments = collaborators.map(collab => collab.dept);
    const conflictingDepartments = conflictingTasks.map(task => task.department);

    const otherTasks = departments.filter(department => 
        !collaboratorDepartments.includes(department) && 
        !conflictingDepartments.includes(department)
    );

    const toggleTaskDetails = (taskId) => {
        setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    };

    const handleRequestConflict = async (taskId) => {
        try {
            if (!id) {
                console.error('No task ID provided.');
                return;
            }
            const tasksRef = collection(db, "tasks");
            const q = query(tasksRef, where("id", "==", id.toString()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0]; 
                const tempData = docData.data();

                const updatedConflictingTasks = tempData.conflictingTasks.map(task => {
                    if (task.id === taskId.toString()) {
                        return { ...task, isRequested: true }; // Mark as requested
                    }
                    return task;
                });

                // Update the Firestore document
                const updatedConflictingTasksRef = doc(db, "tasks", docData.id);
                await updateDoc(updatedConflictingTasksRef, { conflictingTasks: updatedConflictingTasks });

                // Update the local state to reflect the change immediately
                setConflictingTasks(updatedConflictingTasks); // Update the local state
            } else {
                console.log("No tasks found with the given ID.");
            }
        } catch (error) {
            console.error("Error handling conflict request: ", error);
        }
    };

    const handleRequestCollab = async (taskId) => {
        // Your implementation here for handling collaboration requests
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <MdReportProblem size={24} className="mr-2" />
                            Conflicting Tasks
                        </h2>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg">Suggested by AI</h3>
                                    {suggestedTasks.map((task) => (
                                        <div key={task.id} className="mb-2 p-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                                            <div>
                                                <strong>Task Name:</strong> {task.name}
                                                <div className="text-sm text-gray-500">
                                                    <strong>Department:</strong> {task.department}
                                                </div>
                                                {expandedTaskId === task.id && (
                                                    <div className="pl-4 mt-2 text-gray-700">
                                                        <p><strong>Dates:</strong> {task.startDate} - {task.endDate}</p>
                                                        <p><strong>Location:</strong> ({task.latitude}, {task.longitude})</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                className={`ml-4 px-3 py-1 ${task.isRequested ? 'bg-gray-400 text-gray-600 opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`} 
                                                onClick={() => {
                                                    if (!task.isRequested) {
                                                        handleRequestConflict(task.id);
                                                    }
                                                }}
                                                disabled={task.isRequested}
                                            >
                                                {task.isRequested ? 'Requested' : 'Request Collab'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg">Collaborators</h3>
                                    <div className="border-b border-gray-300 mb-2" />
                                    {collabTasks.length === 0 ? (
                                        <p>No collaborator conflicts found.</p>
                                    ) : (
                                        collabTasks.map((task, index) => (
                                            <div key={index} className="mb-2 flex justify-between items-center">
                                                <div className="font-medium">{task.dept}</div>
                                                <button 
                                                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" 
                                                    onClick={() => handleRequestCollab(task.id)}
                                                >
                                                    Request Collab
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mb-4 max-h-40 overflow-y-auto">
                                    <h3 className="font-semibold text-lg">Other Departments</h3>
                                    <div className="border-b border-gray-300 mb-2" />
                                    {otherTasks.length === 0 ? (
                                        <p>No other conflicting tasks found.</p>
                                    ) : (
                                        otherTasks.map((department, index) => (
                                            <div key={index} className="mb-2">
                                                <div className="font-medium">{department}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                        <button onClick={onClose} className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConflictModal;
