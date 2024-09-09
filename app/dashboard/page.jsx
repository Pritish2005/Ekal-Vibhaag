'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Firebase
import { app } from '../../lib/firebaseConfig.js';
import Image from 'next/image.js';

function Dashboard() {
  const userDetails = {
    email: "rujul@gmail.com",
    department: "road",
    role: "admin"
  };

  const db = getFirestore(app);
  const router = useRouter();

  // State to hold tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Set default loading to true initially

  // Fetch tasks when component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where("department", "==", userDetails.department));
        const querySnapshot = await getDocs(q);
        const fetchedTasks = [];

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          fetchedTasks.push({
            id: doc.id,
            description: task.taskDescription,
            name: task.taskName,
            latitude: task.latitude,
            longitude: task.longitude,
            startDate: task.startDate,
            endDate: task.endDate
          });
        });

        setTasks(fetchedTasks); // Update the tasks state
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after tasks are fetched
      }
    };

    fetchTasks(); // Call the function when component mounts
  }, [db, userDetails.department]); // Re-run if db or department changes

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div className="flex items-center">
          <Image
            src={'data:image/png;base64,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'}
            alt="logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-lg font-bold">Welcome, {userDetails.email}</h1>
            <p>Access: Admin</p>
            <p></p>
          </div>
        </div>
        
      </div>

      <div className="mt-8 text-center">
        <div className="flex justify-center gap-4">
          <button
            className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
            onClick={() => router.push('/dashboard/addtask')}
          >
            Add Task
          </button>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            onClick={() => router.push('/dashboard/inventory')}
          >
            View Inventory
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center">Tasks</h2>
        {loading ? (
          <p className="text-center mt-4">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                  <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.description}</p>
                  <p className="text-gray-700 mb-2"><strong>Location:</strong> {task.latitude}, {task.longitude}</p>
                  <p className="text-gray-700 mb-2"><strong>Start:</strong> {task.startDate}</p>
                  <p className="text-gray-700 mb-2"><strong>End:</strong> {task.endDate}</p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">No tasks found for your department.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
