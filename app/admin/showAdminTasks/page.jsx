'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Logo from '../../../assets/Logo.png';

const dummyTasks = [
  {
    id: "#14523",
    description: "Road Maintenance and pothole filling",
    location: "Dwarka Sector 14",
    collaborationWith: ["Water Department #14432"],
    status: "Completed"
  },
  {
    id: "#15643",
    description: "Gas Pipeline Installation",
    location: "Dwarka Sector 14",
    collaborationWith: ["Water Department #14432", "Gas Department #14212"],
    status: "Ongoing"
  },
  {
    id: "#16987",
    description: "Street Light Installation",
    location: "Dwarka Sector 14",
    collaborationWith: [],
    status: "Approval Pending"
  }
];

function ShowAdminTasks() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Set initial time

    return () => clearInterval(intervalId);
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit task ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log(`Delete task ${id}`);
    // Implement delete functionality
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Image src={Logo} width={50} height={50} alt="EkalVibhaag Logo" />
          <h1 className="text-2xl font-bold ml-2">All Tasks</h1>
        </div>
        <div className="text-sm text-gray-600">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Time: {currentTime}</p>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Task ID</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Location</th>
            <th className="py-3 px-4 text-left">Collaboration With</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyTasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{task.id}</td>
              <td className="py-3 px-4">{task.description}</td>
              <td className="py-3 px-4">{task.location}</td>
              <td className="py-3 px-4">
                {task.collaborationWith.length > 0 ? (
                  task.collaborationWith.map((dept, index) => (
                    <div key={index}>{dept}</div>
                  ))
                ) : (
                  "-"
                )}
              </td>
              <td className="py-3 px-4">{task.status}</td>
              <td className="py-3 px-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(task.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowAdminTasks;
