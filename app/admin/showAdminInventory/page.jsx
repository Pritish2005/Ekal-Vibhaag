'use client';
import React, { useEffect, useState } from 'react';

function ShowAdminInventory() {
  const inventoryItems = [
    {
      id: '#1023',
      name: 'Ambuja Cement',
      cost: '₹102.1',
      currentQuantity: 43,
      usedQuantity: 100,
      providedQuantity: 143,
    },
    {
      id: '#3001',
      name: 'PVC Pipes',
      cost: '₹3.64',
      currentQuantity: 210,
      usedQuantity: 480,
      providedQuantity: 690,
    },
    {
      id: '#2331',
      name: 'Steel Rods',
      cost: '₹30',
      currentQuantity: 331,
      usedQuantity: 100,
      providedQuantity: 431,
    },
  ];

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Set initial time

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-100 flex justify-center my-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-5/6">
        <div className="bg-blue-500 text-white py-4 px-6">
          <h1 className="text-xl font-semibold">DEPARTMENT INVENTORY</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">All Inventory Items</h2>
            <div className="text-right text-sm text-gray-500">
              <p>{currentTime}</p>
            </div>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item ID</th>
                <th className="py-3 px-6 text-left">Item Name</th>
                <th className="py-3 px-6 text-left">Unit Cost</th>
                <th className="py-3 px-6 text-center">Current Quantity</th>
                <th className="py-3 px-6 text-center">Used Quantity</th>
                <th className="py-3 px-6 text-center">Provided Quantity</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{item.id}</span>
                  </td>
                  <td className="py-3 px-6 text-left">{item.name}</td>
                  <td className="py-3 px-6 text-left">{item.cost}</td>
                  <td className="py-3 px-6 text-center">{item.currentQuantity}</td>
                  <td className="py-3 px-6 text-center">{item.usedQuantity}</td>
                  <td className="py-3 px-6 text-center">{item.providedQuantity}</td>
                  <td className="py-3 px-6 text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition duration-200">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowAdminInventory;
