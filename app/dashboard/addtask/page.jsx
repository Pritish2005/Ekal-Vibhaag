'use client'
import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Import CSS
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firebase

function Addtask() {
    // User information
    const userDetails = {
        email: "priti@gmail.com",
        department: "water",
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

    // Ref for the map container
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (latitude && longitude && mapContainerRef.current) {
            // Remove map if it's already initialized
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
            // Initialize the map when latitude and longitude are valid
            mapInstance.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // MapTiler style URL
                center: [parseFloat(longitude), parseFloat(latitude)], // Center map based on lat/lon
                zoom: 15, // Initial zoom level
                attributionControl: false
            });

            // Add attribution control to top-left
            mapInstance.current.addControl(new maplibregl.AttributionControl(), 'top-left');
        }
    }, [latitude, longitude]); // Only trigger when lat/lon changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Firebase Firestore reference
            const db = getFirestore();
            const docRef = await addDoc(collection(db, "tasks"), {
                taskName,
                taskDescription,
                startDate,
                endDate,
                isCollab: iscollab,
                collaborator: iscollab ? collaborator : null,
                latitude,
                longitude,
                userEmail: userDetails.email,
                department: userDetails.department,
                role: userDetails.role
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div>
            <h1 className='text-2xl'>Add Task</h1>
            <form className='flex flex-col gap-4'
            //  onSubmit={handleSubmit}
             >
                <input
                    type="text"
                    placeholder="Enter Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter Task Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                />
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='startDate'>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='endDate'>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='flex gap-4'>
                    <input
                        type="checkbox"
                        id='isCollab'
                        checked={iscollab}
                        onChange={() => setIsCollab(!iscollab)}
                    />
                    <label htmlFor='isCollab'>Collab?</label>
                    {iscollab &&
                        <select
                            value={collaborator}
                            onChange={(e) => setCollaborator(e.target.value)}
                            required
                        >
                            <option value=''>Select Collaborator</option>
                            <option value="Water Department">Water Department</option>
                            <option value="Electricity Department">Electricity Department</option>
                            <option value="Fire Department">Fire Department</option>
                        </select>
                    }
                </div>
                <div>
                    <input
                        type='text'
                        placeholder='Enter Latitude'
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                    />
                    <input
                        type='text'
                        placeholder='Enter Longitude'
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                    />
                </div>
                {latitude !== '' && longitude !== '' &&
                    <div style={{ height: '400px', width: '100%' }} ref={mapContainerRef} /> // Map container
                }
                <button type="submit" className='text-blue-600'>Add Task</button>
            </form>
        </div>
    );
}

export default Addtask;
