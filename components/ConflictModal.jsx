'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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

const ConflictModal = ({ latitude, longitude, startDate, endDate, collaborators, isOpen, onClose }) => {
    const [conflictingTasks, setConflictingTasks] = useState([]);
    const [loading, setLoading] = useState(false);
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
            const tasksRef = collection(db, 'tasks');
            const q = query(tasksRef, where("latitude", "==", latitude), where("longitude", "==", longitude));
            const querySnapshot = await getDocs(q);
            const conflicts = [];

            querySnapshot.forEach((doc) => {
                const existingTask = doc.data();
                if (hasDateOverlap(startDate, endDate, existingTask.startDate, existingTask.endDate)) {
                    conflicts.push({
                        id: doc.id,
                        name: existingTask.taskName,
                        department: existingTask.department,
                        description: existingTask.taskDescription,
                        latitude: existingTask.latitude,
                        longitude: existingTask.longitude,
                        startDate: existingTask.startDate,
                        endDate: existingTask.endDate
                    });
                }
            });

            setConflictingTasks(conflicts);
        } catch (error) {
            console.error("Error fetching conflicting tasks: ", error);
        } finally {
            setLoading(false);
        }
    };

    console.log('conflictingTasks:', conflictingTasks);

    const hasDateOverlap = (newStart, newEnd, existingStart, existingEnd) => {
        const newStartDate = new Date(newStart);
        const newEndDate = new Date(newEnd);
        const existingStartDate = new Date(existingStart);
        const existingEndDate = new Date(existingEnd);

        return (newStartDate <= existingEndDate && newEndDate >= existingStartDate);
    };

    console.log(collaborators )
    // Tasks grouped
    const suggestedTasks = conflictingTasks; // Assuming all tasks are suggested by AI for now
    const collabTasks = collaborators;
    
    // Filter "otherTasks" by excluding tasks from collaborators and the conflicting tasks
    const otherTasks = departments.filter(department => 
        !collaborators.includes(department) && 
        !conflictingTasks.some(task => task.department === department)
    );

    const toggleTaskDetails = (taskId) => {
        setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    };

    return (
        <>
            {isOpen && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <MdReportProblem size={24} className="mr-2" />
                            Conflicting Tasks
                        </h2>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                {/* Suggested Tasks by AI */}
                                <div>
                                    <h3 className="font-semibold">Suggested by AI</h3>
                                    {suggestedTasks.length === 0 ? (
                                        <p>No suggested conflicts found.</p>
                                    ) : (
                                        suggestedTasks.map((task) => (
                                            <div key={task.id} className="mb-2">
                                                <div className="cursor-pointer" onClick={() => toggleTaskDetails(task.id)}>
                                                    <strong>Task Name:</strong> - {task.name}
                                                    <strong>Task Department</strong> - {task.department}
                                                </div>
                                                {expandedTaskId === task.id && (
                                                    <div className="pl-4">
                                                        <p><strong>Dates:</strong> {task.startDate} - {task.endDate}</p>
                                                        <p><strong>Location:</strong> ({task.latitude}, {task.longitude})</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Collaborators' Tasks */}
                                <div className="mt-4">
                                    <h3 className="font-semibold">Collaborators</h3>
                                    {collabTasks.length === 0 ? (
                                        <p>No collaborator conflicts found.</p>
                                    ) : (
                                        collabTasks.map((task) => (
                                            <div key={task.id} className="mb-2">
                                                <div className="cursor-pointer" >
                                                    <strong>{task}</strong> 
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Other Departments */}
                                <div className="mt-4">
                                    <h3 className="font-semibold">Other Departments</h3>
                                    {otherTasks.length === 0 ? (
                                        <p>No other conflicting tasks found.</p>
                                    ) : (
                                        otherTasks.map((department, index) => (
                                            <div key={index} className="mb-2">
                                                <div>
                                                    <strong>{department}</strong>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        <button onClick={onClose} style={closeButtonStyle}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Styles for modal
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto'
};

const closeButtonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default ConflictModal;
