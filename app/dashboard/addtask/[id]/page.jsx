'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from '../../../../lib/firebaseConfig.js';

function Tasks() {
  const db = getFirestore(app); // Initialize Firestore
  const params = useParams();
  const id = params.id; // Extract the taskId from the URL params
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id) {
          setError('No task ID provided.');
          setLoading(false);
          return;
        }

        // Reference to the 'tasks' collection
        const tasksRef = collection(db, "tasks");
        // Query where 'taskId' matches the id from params
        const q = query(tasksRef, where("id", "==", id.toString()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming you want the first match in case there are multiple
          const docData = querySnapshot.docs[0].data(); // Fetch the first document
          setTaskData(docData);
        } else {
          setError('No task found with that ID.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, db]); // Add 'id' and 'db' as dependencies so it re-fetches when these change

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className='text-2xl'>Task Details</h1>
      {taskData ? (
        <div className="p-4 bg-gray-100 rounded shadow">
          <p><strong>Task Name:</strong> {taskData.taskName}</p>
          <p><strong>Description:</strong> {taskData.taskDescription}</p>
          <p><strong>Department:</strong> {taskData.department}</p>
          <p><strong>Start Date:</strong> {taskData.startDate}</p>
          <p><strong>End Date:</strong> {taskData.endDate}</p>
          <p><strong>Collaborator:</strong> {taskData.collaborator ? taskData.collaborator : "None"}</p>
          <p><strong>Latitude:</strong> {taskData.latitude}</p>
          <p><strong>Longitude:</strong> {taskData.longitude}</p>
        </div>
      ) : (
        <p>No task data to display.</p>
      )}
    </div>
  );
}

export default Tasks;
