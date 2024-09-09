'use client'
import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Import CSS
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firebase
import { app } from '../../../lib/firebaseConfig.js';
import { useRouter } from 'next/navigation.js';

function Addtask() {
    // User information
    const db = getFirestore(app);
    const userDetails = {
        email: "rujul@gmail.com",
        department: "road",
        role: "admin"
    };

    // State for all inputs
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [iscollab, setIsCollab] = useState(false);
    const [collaborator, setCollaborator] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState(null);
    const [conflictingTasks, setConflictingTasks] = useState([]);
    const [proceed, setProceed] = useState(false); // Flag to handle override
    const [resourceAllocation, setResourceAllocation] = useState(0);
    const [loading, setLoading] = useState(false);

    // Ref for the map container
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const router = useRouter();

    // Initialize the map when latitude and longitude are valid
    useEffect(() => {
        if (latitude && longitude && mapContainerRef.current) {
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
            mapInstance.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
                center: [parseFloat(longitude), parseFloat(latitude)],
                zoom: 17,
                attributionControl: false
            });

            mapInstance.current.addControl(new maplibregl.AttributionControl(), 'top-left');
        }
    }, [latitude, longitude]);

    const uniqueId = Date.now().toString();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Check for conflicts only if not already overriding
        if (!proceed) {
            const conflicts = await checkForConflicts();
            if (conflicts.length > 0) {
                setConflictingTasks(conflicts);
                setError('Conflicting task found. Do you wish to proceed?');
                setLoading(false); // Stop loading when conflicts are found
                return;
            }
        }
    
        // If no conflicts or user has chosen to proceed
        try {
            const docRef = await addDoc(collection(db, "tasks"), {
                id: uniqueId,
                taskName,
                taskDescription,
                startDate,
                endDate,
                isCollab: iscollab,
                collaborator: iscollab ? collaborator : null,
                latitude,
                longitude,
                resourceAllocation,
                userEmail: userDetails.email,
                department: userDetails.department,
                conflictingTasks: conflictingTasks, // Add the conflicting tasks info
                conflictExists: conflictingTasks.length > 0, // Boolean to indicate conflict
                role: userDetails.role
            });
    
            console.log("Document written with ID: ", docRef.id);
    
            // After adding the current task, update the conflicting tasks
            for (let conflict of conflictingTasks) {
                const conflictingTaskRef = collection(db, 'tasks');
                const q = query(conflictingTaskRef, where('id', '==', conflict.id));
                const querySnapshot = await getDocs(q);
    
                querySnapshot.forEach(async (doc) => {
                    // Update the conflicting task with the current task's conflict
                    const docRef = doc.ref;
                    const existingConflicts = doc.data().conflictingTasks || [];
    
                    await docRef.update({
                        conflictingTasks: [...existingConflicts, {
                            id: uniqueId,
                            department: userDetails.department,
                            description: taskDescription,
                            latitude: latitude,
                            longitude: longitude,
                            startDate: startDate,
                            endDate: endDate
                        }],
                        conflictExists: true // Ensure the conflictExists flag is set to true
                    });
                });
            }
    
            router.push(`/dashboard/addtask/${uniqueId}`);
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false); // Always stop loading after the task is added
        }
    };

    // Function to check for conflicting tasks
    const checkForConflicts = async () => {
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where("latitude", "==", latitude), where("longitude", "==", longitude));
        const querySnapshot = await getDocs(q);
        const conflicts = [];

        querySnapshot.forEach((doc) => {
            const existingTask = doc.data();
            if (hasDateOverlap(startDate, endDate, existingTask.startDate, existingTask.endDate)) {
                conflicts.push({
                    id: doc.id,
                    department: existingTask.department,
                    description: existingTask.taskDescription,
                    latitude: existingTask.latitude,
                    longitude: existingTask.longitude,
                    startDate: existingTask.startDate,
                    endDate: existingTask.endDate
                });
            }
        });

        return conflicts;
    };

    // Helper function to check for overlapping dates
    const hasDateOverlap = (newStart, newEnd, existingStart, existingEnd) => {
        const newStartDate = new Date(newStart);
        const newEndDate = new Date(newEnd);
        const existingStartDate = new Date(existingStart);
        const existingEndDate = new Date(existingEnd);

        return (newStartDate <= existingEndDate && newEndDate >= existingStartDate);
    };

    const handleProceed = () => {
        setProceed(true);
        setError(null); // Clear the error and proceed with task creation
        setLoading(true); // Start loading when the user decides to proceed
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className='text-3xl font-bold mb-6 text-center'>Add Task</h1>
            {error && 
                <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                    <p>{error}</p>
                    {conflictingTasks.length > 0 && 
                        <div>
                            <h2 className="text-lg font-semibold">Conflicting Tasks:</h2>
                            <ul className="list-disc pl-6">
                                {conflictingTasks.map((task, index) => (
                                    <li key={index} className="mt-2">
                                        <strong>Description:</strong> {task.description} <br />
                                        <strong>Location:</strong> {task.latitude}, {task.longitude} <br />
                                        <strong>Start:</strong> {task.startDate} <br />
                                        <strong>End:</strong> {task.endDate}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleProceed} className='bg-blue-500 text-white mt-4 px-4 py-2 rounded-lg hover:bg-blue-600'>
                                Proceed Anyway
                            </button>
                        </div>
                    }
                </div>
            }
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                    type="text"
                    placeholder="Enter Task Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Enter Resource Allocation"
                    value={resourceAllocation}
                    onChange={(e) => setResourceAllocation(e.target.value)}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='startDate' className='mb-2 font-medium'>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='endDate' className='mb-2 font-medium'>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <input
                        type="checkbox"
                        id='isCollab'
                        checked={iscollab}
                        onChange={() => setIsCollab(!iscollab)}
                        className="h-4 w-4"
                    />
                    <label htmlFor='isCollab' className="font-medium">Collaborate?</label>
                    {iscollab &&
                        <select
                            value={collaborator}
                            onChange={(e) => setCollaborator(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-lg"
                        >
                            <option value=''>Select Collaborator</option>
                            <option value="Water Department">Water Department</option>
                            <option value="Electricity Department">Electricity Department</option>
                            <option value="Fire Department">Fire Department</option>
                        </select>
                    }
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type='text'
                        placeholder='Enter Latitude'
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                        className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type='text'
                        placeholder='Enter Longitude'
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                        className="p-3 border border-gray-300 rounded-lg"
                    />
                </div>
                {latitude !== '' && longitude !== '' &&
                    <div style={{ height: '400px', width: '100%' }} ref={mapContainerRef} className="mt-6 rounded-lg border border-gray-300" /> // Map container
                }
                <button type="submit" className='bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600'>
                    {
                        loading ?
                        'Loading...'
                        :
                        'Add Task'
                    }
                </button>
            </form>
        </div>
    );
}

export default Addtask;
