'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Firebase
import { app } from '../../lib/firebaseConfig.js';

function Dashboard() {
  const userDetails = {
    email: "priti@gmail.com",
    department: "water",
    role: "admin"
  };

  const db = getFirestore(app);
  const router = useRouter();

  // State to hold tasks
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when component loads
  useEffect(() => {
    const fetchTasks = async () => {
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
    };

    fetchTasks(); // Call the function when component mounts
  }, [db, userDetails.department]); // Re-run if db or department changes

  return (
    <div>
      <p>Welcome {userDetails.email}</p>
      <button className='text-blue-600' onClick={() => router.push('/dashboard/addtask')}>Add Task</button>
      <div>
        <h2>Tasks</h2>
        <ul className='flex flex-col gap-7'>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li className=' border-2 border-blue-600 rounded-lg p-4' key={index}>
                <strong>Description:</strong> {task.description} <br />
                <strong>Name:</strong> {task.name} <br />
                <strong>Location:</strong> {task.latitude}, {task.longitude} <br />
                <strong>Start:</strong> {task.startDate} <br />
                <strong>End:</strong> {task.endDate}
              </li>
            ))
          ) : (
            <p>No tasks found for your department.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
