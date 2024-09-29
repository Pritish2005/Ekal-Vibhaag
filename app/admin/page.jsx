'use client';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { app } from '../../lib/firebaseConfig.js';
import { MdCheckCircle } from "react-icons/md";

function Admin() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const db = getFirestore(app);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Set initial time

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    try {
      setLoading(true); // Start loading
      const tasksRef = collection(db, "tasks");
      const querySnapshot = await getDocs(tasksRef);
      const userDepartment = session?.user?.department; 

      const filteredTasks = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(task => 
          task.collaborator?.some(collab => collab.dept === userDepartment && collab.isRequested) || 
          task.conflictingTasks?.some(task => task.department === userDepartment && task.isRequested)
        );

      setTasks(filteredTasks);
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      setLoading(false); // Stop loading on error
    }
  };

  const handleApproveTask = async (taskId, type, dept) => {
    try {
        if (!taskId) {
            console.error('No task ID provided.');
            return;
        }

        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("id", "==", taskId.toString()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0]; // Get the first document that matches
            const taskData = docData.data(); // Get the task data
            const taskDocId = docData.id; // This is the Firestore document ID

            let updatedTask;
            if (type === "conflicting") {
                const updatedConflictingTasks = taskData.conflictingTasks.map(task => {
                    if (task.department === dept) {
                        return { ...task, isRequested: false, isConflicting: false };
                    }
                    return task;
                });
                updatedTask = { ...taskData, conflictingTasks: updatedConflictingTasks };
            } else if (type === "collaborator") {
                const updatedCollaborators = taskData.collaborator.map(collab => {
                    if (collab.dept === dept) {
                        return { ...collab, isRequested: false };
                    }
                    return collab;
                });
                updatedTask = { ...taskData, collaborator: updatedCollaborators };
            }

            const taskRef = doc(db, "tasks", taskDocId); 
            await updateDoc(taskRef, updatedTask);

            fetchTasks(); // Refetch tasks to refresh the UI
        } else {
            console.log('No matching task found.');
        }
    } catch (error) {
        console.error("Error updating task: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-8 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Approval Window</h1>
            <p className="text-sm text-gray-600">All Pending Tasks</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Time: {currentTime}</p>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500">No Tasks Exist</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-gray-600">Department</th>
                <th className="py-2 px-4 text-gray-600">Task ID</th>
                <th className="py-2 px-4 text-gray-600">Description</th>
                <th className="py-2 px-4 text-gray-600">Dates</th>
                <th className="py-2 px-4 text-gray-600">Issued By</th>
                <th className="py-2 px-4 text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <React.Fragment key={task.id}>
                  {task.conflictingTasks?.map((confTask) => (
                    confTask.department === session?.user?.department && confTask.isRequested && (
                      <tr key={confTask.id} className="border-b hover:bg-gray-50 transition duration-200">
                        <td className="py-4 px-4 text-gray-800">{task.department}</td>
                        <td className="py-4 px-4 text-gray-800">{task.id}</td>
                        <td className="py-4 px-4 text-gray-800">{confTask.description}</td>
                        <td className="py-4 px-4 text-gray-800">{confTask.startDate} - {confTask.endDate}</td>
                        <td className="py-4 px-4 text-gray-800">{confTask.issuedBy}</td>
                        <td className="py-4 px-4 text-center">
                          <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-green-600 transition duration-200 flex items-center justify-center"
                            onClick={() => handleApproveTask(task.id, "conflicting", confTask.department)}
                          >
                            <MdCheckCircle className="mr-2" />
                            Approve
                          </button>
                        </td>
                      </tr>
                    )
                  ))}

                  {task.collaborator?.map((collab) => (
                    collab.dept === session?.user?.department && collab.isRequested && (
                      <tr key={collab.id} className="border-b hover:bg-gray-50 transition duration-200">
                        <td className="py-4 px-4 text-gray-800">{collab.dept}</td>
                        <td className="py-4 px-4 text-gray-800">{task.id}</td>
                        <td className="py-4 px-4 text-gray-800">Collaboration Request</td>
                        <td className="py-4 px-4 text-gray-800">-</td>
                        <td className="py-4 px-4 text-gray-800">{collab.issuedBy}</td>
                        <td className="py-4 px-4 text-center">
                          <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-green-600 transition duration-200 flex items-center justify-center"
                            onClick={() => handleApproveTask(task.id, "collaborator", collab.dept)}
                          >
                            <MdCheckCircle className="mr-2" />
                            Approve
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;
