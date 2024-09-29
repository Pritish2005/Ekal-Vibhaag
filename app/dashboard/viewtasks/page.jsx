'use client'
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { app } from "../../../lib/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { AiOutlineEdit } from "react-icons/ai";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth

const db = getFirestore(app);

const TasksPage = () => {
  const { data: session, status } = useSession(); // Get session info from NextAuth
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.department) {
      // Fetch tasks only if the user is authenticated and their department is available
      const fetchTasks = async () => {
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
      };

      fetchTasks();
    }
  }, [session, status]);

  // Handle editing of task
  const handleEdit = (task) => {
    setEditTask(task);
  };

  // Handle task updates
  const handleSave = async (taskId) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, {
      ...editTask,
    });
    setEditTask(null); // Close the edit form
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
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

      {editTask && (
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Edit Task #{editTask.id}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label>Description</label>
              <input
                type="text"
                value={editTask.taskDescription}
                onChange={(e) =>
                  setEditTask({ ...editTask, taskDescription: e.target.value })
                }
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
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => handleSave(editTask.id)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
