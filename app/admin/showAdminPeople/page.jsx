'use client'
import React from 'react';
import DefaultImage from '../../../assets/DefaultPfP.svg'

function ShowAdminPeople() {
  const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png'; // Replace with the actual path to your default image
  const peopleData = [
    {
      id: 1,
      name: 'Rujul',
      email: 'rujul@example.com',
      lastLogin: 'Sept 30, 2024',
      imageUrl: '', // Empty string to test the default image
    },
    {
      id: 2,
      name: 'Pritish',
      email: 'pritish@example.com',
      lastLogin: 'Sept 28, 2024',
      imageUrl: '',
    },
    {
      id: 3,
      name: 'Harsh',
      email: 'harsh@example.com',
      lastLogin: 'Sept 25, 2024',
      imageUrl: '',
    },
    {
      id: 4,
      name: 'Revant',
      email: 'revant@example.com',
      lastLogin: 'Sept 22, 2024',
      imageUrl: '', // Empty string to test the default image
    },
  ];

  const handleRemoveAccess = (id) => {
    // Logic to remove access for the person with the given ID
    console.log(`Remove access for person with ID: ${id}`);
    // Implement your logic here, e.g., API call to remove access
  };

  return (
    <div className="bg-gray-100  flex justify-center my-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-5/6">
        <div className="bg-blue-500 text-white py-4 px-6">
          <h1 className="text-xl font-semibold">TEAM MEMBERS</h1>
        </div>
        <div className="p-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Last Login</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {peopleData.map((person) => (
                <tr key={person.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={person.imageUrl || defaultImageUrl}
                      alt={person.name || 'Default User'}
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{person.name}</td>
                  <td className="py-3 px-6 text-left">{person.email}</td>
                  <td className="py-3 px-6 text-left">{person.lastLogin}</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleRemoveAccess(person.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove Access
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

export default ShowAdminPeople;
