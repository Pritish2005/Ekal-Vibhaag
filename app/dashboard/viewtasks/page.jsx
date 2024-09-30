'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from '../../../lib/firebaseConfig.js';
import { useSession } from 'next-auth/react'; // Import useSession from NextAuth

function ViewTask() {
  const db = getFirestore(app);  // Firestore instance
  const { data: session, status } = useSession();  // Get session info
  const [tasks, setTasks] = useState([]);  // State to store tasks
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (status === 'authenticated' && session?.user?.department) {
          const tasksCollection = collection(db, 'tasks');  
          const q = query(tasksCollection, where('department', '==', session.user.department));  
          const tasksSnapshot = await getDocs(q);  
          const tasksList = tasksSnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
          }));  
          setTasks(tasksList);  
        }
      } catch (err) {
        setError('Error fetching tasks.');
      } finally {
        setLoading(false);  
      }
    };

    if (status !== 'loading') {
      fetchTasks();  
    }
  }, [db, session, status]);

  if (loading) return <div className="text-center"><p className="text-lg">Loading tasks...</p></div>;  
  if (error) return <div className="text-center"><p className="text-red-600">{error}</p></div>;  

  if (status === 'unauthenticated') {
    return <div className="text-center"><p className="text-lg text-red-600">You must be logged in to view tasks.</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Tasks for Department: {session?.user?.department}</h1>
      {tasks.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 border-b">Task Name</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4 border-b">{task.taskName}</td>
                <td className="py-3 px-4 border-b">{task.taskDescription}</td>
                <td className={`py-3 px-4 border-b font-medium ${task.isPending ? 'text-yellow-600' : 'text-green-600'}`}>
                  {task.isPending ? 'Pending' : 'Completed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No tasks found for your department.</p>
      )}
    </div>
  );
}

export default ViewTask;
