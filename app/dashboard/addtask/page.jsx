'use client';
import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Import CSS
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firebase
import { app } from '../../../lib/firebaseConfig.js';
import { useRouter } from 'next/navigation.js';
import { useSession } from 'next-auth/react';
import { MdReportProblem } from "react-icons/md";
import ConflictModal from '../../../components/ConflictModal';

function Addtask() {
    // Hooks should always be declared at the top
    const db = getFirestore(app);
    const { data: session, status } = useSession(); // Access session data and status
    const userDetails = session?.user || {}; // Handle session undefined case safely

    const collaboratorsArray = [
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
    

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [collaborator, setCollaborator] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [iscollab, setIsCollab] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState(null);
    const [conflictingTasks, setConflictingTasks] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [resourceAllocation, setResourceAllocation] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSubmitBlocked, setIsSubmitBlocked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uniqueId, setUniqueId] = useState(Date.now().toString()); // Store unique ID in state

    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const router = useRouter();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading state
        setError(null); // Reset error before submission
    
        // Check for conflicts
        const conflicts = await checkForConflicts();
    
        // Set isPending based on conflicts or collaborator selection
        const hasConflicts = conflicts.length > 0;
        const hasCollaborators = iscollab && collaborator.length > 0;
    
        // Create modified collaborator array
        const modifiedCollaborators = collaborator.map(dept => ({
            dept: dept,
            isRequested: false,
            isConflicting: hasConflicts // or any logic to determine if it's conflicting
        }));
    
        if (hasConflicts || hasCollaborators) {
            // Show confirmation dialog
            const userConfirmed = window.confirm("Conflicting tasks found. Do you want to proceed anyway?");
            if (!userConfirmed) {
                // If user cancels, reset loading and return early
                setLoading(false);
                return;
            }
    
            // Block submission if conflicts or collaborators are selected
            setConflictingTasks(conflicts); // Set conflicting tasks to state
            setError('Conflicting task found or collaborators selected.');
            setIsSubmitBlocked(true); // Block submission
            setIsPending(true); // Set pending to true
            openModal(); // Open the modal
            await saveTaskToFirebase(true, conflicts, modifiedCollaborators); // Save task as pending
        } else {
            // If no conflicts and no collaborators, proceed with submission
            setIsSubmitBlocked(false);
            setIsPending(false);
            await saveTaskToFirebase(false, [], modifiedCollaborators); // Save task without conflicts
            router.push(`/dashboard/addtask/${uniqueId}`); // Redirect to dashboard
        }
    
        setLoading(false); // Stop loading after submission
    };
    
    
    const saveTaskToFirebase = async (isPending, conflicts, collaborators) => {
        try {
            const docRef = await addDoc(collection(db, "tasks"), {
                id: uniqueId,
                taskName,
                taskDescription,
                startDate,
                endDate,
                isCollab: iscollab,
                collaborator: iscollab ? collaborators : null, // Use modified collaborator array
                latitude,
                longitude,
                resourceAllocation,
                userEmail: userDetails.email,
                department: userDetails.department,
                conflictingTasks: conflicts, // conflicts include isRequested and isConflicting
                isPending,
            });
    
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
            setError('Failed to submit task.');
        }
    };
    
    const checkForConflicts = async () => {
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where("latitude", "==", latitude), where("longitude", "==", longitude));
        const querySnapshot = await getDocs(q);
        const conflicts = [];
    
        querySnapshot.forEach((doc) => {
            const existingTask = doc.data();
            if (hasDateOverlap(startDate, endDate, existingTask.startDate, existingTask.endDate)) {
                conflicts.push({
                    id: existingTask.id,
                    name: existingTask.taskName,
                    department: existingTask.department,
                    description: existingTask.taskDescription,
                    latitude: existingTask.latitude,
                    longitude: existingTask.longitude,
                    startDate: existingTask.startDate,
                    endDate: existingTask.endDate,
                    isRequested: false, // Add isRequested property
                    isConflicting: true // Add isConflicting property
                });
            }
        });
    
        return conflicts;
    };
    


    const hasDateOverlap = (newStart, newEnd, existingStart, existingEnd) => {
        const newStartDate = new Date(newStart);
        const newEndDate = new Date(newEnd);
        const existingStartDate = new Date(existingStart);
        const existingEndDate = new Date(existingEnd);

        return (newStartDate <= existingEndDate && newEndDate >= existingStartDate);
    };

    // Render based on session and status
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-bold">Please Login</h1>
                <p className="mt-4">You need to be logged in to view this page.</p>
            </div>
        );
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className='text-3xl font-bold mb-6 text-center'>Add Task</h1>
        <button 
            onClick={openModal} 
            className="flex items-center bg-red-500 my-4 mx-auto text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
            See Conflicts
        </button>

        <ConflictModal id={uniqueId} isOpen={isModalOpen} onClose={closeModal} /> 
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                {/* Form Fields */}
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
                {/* Date Fields */}
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
                {/* Coordinates */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='latitude' className='mb-2 font-medium'>Latitude</label>
                        <input
                            type="text"
                            placeholder="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='longitude' className='mb-2 font-medium'>Longitude</label>
                        <input
                            type="text"
                            placeholder="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
                {/* Collaborator */}
                <div className='flex items-center'>
    <label htmlFor='isCollab' className='font-medium mr-3'>Is this a Collaborative Task?</label>
    <input
        type="checkbox"
        checked={iscollab}
        onChange={(e) => setIsCollab(e.target.checked)}
        id="isCollab"
    />
</div>

{iscollab && (
    <div className="flex flex-col">
        <label htmlFor="collaborator" className="font-medium">Select Collaborators</label>
        <select
            multiple
            value={collaborator}
            onChange={(e) => setCollaborator(Array.from(e.target.selectedOptions, option => option.value))}
            className="p-3 border border-gray-300 rounded-lg"
        >
            {collaboratorsArray.map((collab, index) => (
                <option key={index} value={collab}>{collab}</option>
            ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</p>
    </div>
)}

                {/* Submit Button */}
                <button
    type="submit"
    disabled={loading || isSubmitBlocked}
    className="bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 disabled:opacity-50"
>
    {loading ? 'Submitting...' : isPending ? 'Conflicts Exist' : 'Submit Task'}
</button>
            </form>
        </div>
    );
}

export default Addtask;
