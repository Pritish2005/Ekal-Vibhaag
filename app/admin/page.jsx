'use client';
import React, { useEffect, useState } from 'react';

function Admin() {
  // Dummy data array
  const tasks = [
    {
      id: '#14523',
      department: 'Water Department',
      description: 'Road Maintenance and pothole filling',
      location: 'Dwarka Sector 14',
    },
    {
      id: '#15643',
      department: 'Gas Department',
      description: 'Gas Pipeline Installation',
      location: 'Dwarka Sector 14',
    },
    {
      id: '#16987',
      department: 'Electricity Department',
      description: 'Street Light Installation',
      location: 'Dwarka Sector 14',
    },
  ];

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Set initial time

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
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

        {/* Task Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-gray-600">Department</th>
              <th className="py-2 px-4 text-gray-600">Task ID</th>
              <th className="py-2 px-4 text-gray-600">Description</th>
              <th className="py-2 px-4 text-gray-600">Location</th>
              <th className="py-2 px-4 text-gray-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="py-4 px-4 text-gray-800">{task.department}</td>
                <td className="py-4 px-4 text-gray-800">{task.id}</td>
                <td className="py-4 px-4 text-gray-800">{task.description}</td>
                <td className="py-4 px-4 text-gray-800">{task.location}</td>
                <td className="py-4 px-4 text-center">
                  <button className="bg-green-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-green-600 transition duration-200">
                    Accept
                  </button>
                  <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
