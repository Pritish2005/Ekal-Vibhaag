// 'use client'
// import { useState, useEffect } from "react";
// import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
// import { app } from "../../lib/firebaseConfig";
// import { getFirestore } from "firebase/firestore";
// import { AiOutlineEdit } from "react-icons/ai";
// const db = getFirestore(app);

// const TasksPage = () => {
//   const [tasks, setTasks] = useState([]);
//   const [editTask, setEditTask] = useState(null);
//   const [department, setDepartment] = useState("Ministry of Jal Shakti"); // Default department

//   // Fetch tasks from Firebase
//   useEffect(() => {
//     const fetchTasks = async () => {
//       // Firestore query with condition where department = department
//       const q = query(collection(db, "tasks"), where("department", "==", department));
//       const tasksCollection = await getDocs(q);
//       const tasksList = tasksCollection.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTasks(tasksList);
//     };

//     fetchTasks();
//   }, [department]); // Fetch tasks again when department changes

//   // Handle editing of task
//   const handleEdit = (task) => {
//     setEditTask(task);
//   };

//   // Handle task updates
//   const handleSave = async (taskId) => {
//     const taskDoc = doc(db, "tasks", taskId);
//     await updateDoc(taskDoc, {
//       ...editTask,
//     });
//     setEditTask(null); // Close the edit form
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6">All Tasks in {department}</h1>
      
//       {/* Add department selection */}
//       <div className="mb-6">
//         <label htmlFor="department">Select Department: </label>
//         <select
//           id="department"
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//           className="p-2 border rounded"
//         >
          
//           <option value="Ministry of Jal Shakti">Ministry of Jal Shakti</option>
//           <option value="Ministry of Finance">Ministry of Finance</option>
//           <option value="Ministry of Health">Ministry of Health</option>
//           <option value="Ministry of Education">Ministry of Education</option>
//           <option value="Ministry of Defence">Ministry of Defence</option>
//           <option value="Ministry of Agriculture">Ministry of Agriculture</option>
//           <option value="Ministry of Home Affairs">Ministry of Home Affairs</option>
//           <option value="Ministry of Transport">Ministry of Transport</option>
//           <option value="Ministry of Labour and Employment">Ministry of Labour and Employment</option>
//           <option value="Ministry of Environment">Ministry of Environment</option>
//         </select>
//       </div>

//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Task ID</th>
//             <th className="py-2 px-4 border-b">Description</th>
//             <th className="py-2 px-4 border-b">Location</th>
//             <th className="py-2 px-4 border-b">Collaboration With</th>
//             <th className="py-2 px-4 border-b">Status</th>
//             <th className="py-2 px-4 border-b">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task) => (
//             <tr key={task.id}>
//               <td className="py-2 px-4 border-b">#{task.id}</td>
//               <td className="py-2 px-4 border-b">{task.taskDescription}</td>
//               <td className="py-2 px-4 border-b">
//                 {task.latitude}, {task.longitude}
//               </td>
//               <td className="py-2 px-4 border-b">
//                 {task.isCollab ? task.collaborator : "-"}
//               </td>
//               <td className="py-2 px-4 border-b">
//                 {task.conflictExists ? "Conflict" : "No Conflict"}
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <button
//                   className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
//                   onClick={() => handleEdit(task)}
//                 >
//                   <AiOutlineEdit className="mr-2" />
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {editTask && (
//         <div className="mt-6">
//           <h2 className="text-2xl mb-4">Edit Task #{editTask.id}</h2>
//           <div className="flex flex-col gap-4">
//             <div>
//               <label>Description</label>
//               <input
//                 type="text"
//                 value={editTask.taskDescription}
//                 onChange={(e) =>
//                   setEditTask({ ...editTask, taskDescription: e.target.value })
//                 }
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label>Collaborator</label>
//               <input
//                 type="text"
//                 value={editTask.collaborator || ""}
//                 onChange={(e) =>
//                   setEditTask({ ...editTask, collaborator: e.target.value })
//                 }
//                 className="w-full p-2 border rounded"
//                 disabled={!editTask.isCollab}
//               />
//             </div>
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
//               onClick={() => handleSave(editTask.id)}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TasksPage;
"use client";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { app } from "../../lib/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { AiOutlineEdit } from "react-icons/ai";

const db = getFirestore(app);

// Sample tasks data
const sampleTasks = [
  {
    taskDescription: "Water pipeline installation in rural areas",
    department: "Ministry of Jal Shakti",
    latitude: 28.7041,
    longitude: 77.1025,
    isCollab: true,
    collaborator: "Ministry of Health",
    conflictExists: false,
  },
  {
    taskDescription: "Budget review and allocation for next quarter",
    department: "Ministry of Finance",
    latitude: 28.6139,
    longitude: 77.209,
    isCollab: false,
    collaborator: "",
    conflictExists: false,
  },
  {
    taskDescription: "Construction of new hospital",
    department: "Ministry of Health",
    latitude: 19.076,
    longitude: 72.8777,
    isCollab: true,
    collaborator: "Ministry of Defence",
    conflictExists: true,
  },
  {
    taskDescription: "National education policy review",
    department: "Ministry of Education",
    latitude: 26.8467,
    longitude: 80.9462,
    isCollab: false,
    collaborator: "",
    conflictExists: false,
  },
  {
    taskDescription: "Defence equipment procurement",
    department: "Ministry of Defence",
    latitude: 28.6139,
    longitude: 77.209,
    isCollab: true,
    collaborator: "Ministry of Finance",
    conflictExists: false,
  },
  {
    taskDescription: "Road construction in Northern region",
    department: "Ministry of Transport",
    latitude: 31.1471,
    longitude: 75.3412,
    isCollab: true,
    collaborator: "Ministry of Home Affairs",
    conflictExists: true,
  },
  {
    taskDescription: "Labour law reform discussions",
    department: "Ministry of Labour and Employment",
    latitude: 28.7041,
    longitude: 77.1025,
    isCollab: false,
    collaborator: "",
    conflictExists: false,
  },
  {
    taskDescription: "Environmental policy implementation in national parks",
    department: "Ministry of Environment",
    latitude: 22.5726,
    longitude: 88.3639,
    isCollab: true,
    collaborator: "Ministry of Agriculture",
    conflictExists: false,
  },
];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [department, setDepartment] = useState("Ministry of Jal Shakti"); // Default department

  // Function to populate Firestore with sample data
  // const populateTasks = async () => {
  //   const tasksSnapshot = await getDocs(collection(db, "tasks"));
      
  //     sampleTasks.forEach(async (task) => {
  //       await addDoc(collection(db, "tasks"), task);
  //     });
  //     console.log("Sample tasks added to Firestore.");

  // };

  // Fetch tasks from Firebase
  useEffect(() => {
    const fetchTasks = async () => {
      // Firestore query with condition where department = department
      const q = query(
        collection(db, "tasks"),
        where("department", "==", department)
      );
      const tasksCollection = await getDocs(q);
      const tasksList = tasksCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };

    // Populate tasks if not already present
    // populateTasks();
    fetchTasks();
  }, [department]); // Fetch tasks again when department changes

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Tasks in {department}</h1>

      {/* Add department selection */}
      <div className="mb-6">
        <label htmlFor="department">Select Department: </label>
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Ministry of Jal Shakti">Ministry of Jal Shakti</option>
          <option value="Ministry of Finance">Ministry of Finance</option>
          <option value="Ministry of Health">Ministry of Health</option>
          <option value="Ministry of Education">Ministry of Education</option>
          <option value="Ministry of Defence">Ministry of Defence</option>
          <option value="Ministry of Agriculture">
            Ministry of Agriculture
          </option>
          <option value="Ministry of Home Affairs">
            Ministry of Home Affairs
          </option>
          <option value="Ministry of Transport">Ministry of Transport</option>
          <option value="Ministry of Labour and Employment">
            Ministry of Labour and Employment
          </option>
          <option value="Ministry of Environment">
            Ministry of Environment
          </option>
        </select>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Task ID</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Collaboration With</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
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
              
            </tr>
          ))}
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
