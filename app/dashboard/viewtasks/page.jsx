"use client";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../../lib/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { AiOutlineEdit } from "react-icons/ai";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth

const db = getFirestore(app);

const TasksPage = () => {
  const { data: session, status } = useSession(); // Get session info from NextAuth
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true); // Loading state
  const [saveLoading, setSaveLoading] = useState(false); // Save loading state
  const [saveSuccess, setSaveSuccess] = useState(null); // Save success state

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Start loading
      if (status === "authenticated" && session?.user?.department) {
        const q = query(
          collection(db, "tasks"),
          where("department", "==", session.user.department) // Filter by user's department
        );
        const tasksCollection = await getDocs(q);
        const tasksList = tasksCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksList);
      }
      setLoading(false); // End loading
    };

    fetchTasks();
  }, [session, status]);

  // Handle opening the edit modal
  const handleEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true); // Open modal when editing a task
  };

  // Handle task updates
  const handleSave = async (taskId) => {
    setSaveLoading(true); // Start save loading
    setSaveSuccess(null); // Reset save success state
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, {
        ...editTask,
      });
      setEditTask(null); // Close the edit form
      setIsModalOpen(false); // Close modal after saving changes
      // Refresh the tasks after saving
      await fetchTasks(); // Re-fetch tasks
      setSaveSuccess(true); // Set save success to true
    } catch (error) {
      console.error("Error updating task:", error);
      setSaveSuccess(false); // Set save success to false on error
    } finally {
      setSaveLoading(false); // End save loading
    }
  };

  // Fetch tasks as a separate function for reuse
  const fetchTasks = async () => {
    if (status === "authenticated" && session?.user?.department) {
      const q = query(
        collection(db, "tasks"),
        where("department", "==", session.user.department) // Filter by user's department
      );
      const tasksCollection = await getDocs(q);
      const tasksList = tasksCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    }
  };

  // Show loading state while session is being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  // If the user is not authenticated, show a message
  if (status === "unauthenticated") {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Tasks for Department: {session?.user?.department}
      </h1>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Task ID</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Collaboration With</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="py-2 px-4 border-b">#{task.id}</td>
                <td className="py-2 px-4 border-b">{task.taskDescription}</td>
                <td className="py-2 px-4 border-b">
                  {task.latitude}, {task.longitude}
                </td>
                <td className="py-2 px-4 border-b">
                  {task.isCollab ? task.collaborator : "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {task.conflictExists ? "Conflict" : "No Conflict"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleEdit(task)}
                  >
                    <AiOutlineEdit className="mr-2" />
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No tasks found for your department.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for editing task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Edit Task #{editTask.id}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label>Description</label>
                <input
                  type="text"
                  value={editTask.taskDescription}
                  onChange={(e) =>
                    setEditTask({
                      ...editTask,
                      taskDescription: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>Location (Latitude, Longitude)</label>
                <input
                  type="text"
                  value={`${editTask.latitude}, ${editTask.longitude}`}
                  onChange={(e) => {
                    const [lat, lng] = e.target.value
                      .split(",")
                      .map((coord) => coord.trim());
                    setEditTask({ ...editTask, latitude: lat, longitude: lng });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>Collaborator</label>
                <input
                  type="text"
                  value={editTask.collaborator || ""}
                  onChange={(e) =>
                    setEditTask({ ...editTask, collaborator: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  disabled={!editTask.isCollab}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  value={editTask.conflictExists ? "Conflict" : "No Conflict"}
                  onChange={(e) =>
                    setEditTask({
                      ...editTask,
                      conflictExists: e.target.value === "Conflict",
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="No Conflict">No Conflict</option>
                  <option value="Conflict">Conflict</option>
                </select>
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleSave(editTask.id)}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Loading Indicator */}
      {saveLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <h1 className="text-2xl text-white">Saving changes...</h1>
        </div>
      )}

      {/* Alert for Save Success/Failure */}
      {saveSuccess !== null && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${
            saveSuccess ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {saveSuccess
            ? "Changes saved successfully!"
            : "Failed to save changes!"}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
