'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ShowAdminPeople() {
  const [peopleData, setPeopleData] = useState([]);
  const { data: session, status } = useSession();
  const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png';

  useEffect(() => {
    if (status !== 'loading' && session?.user?.department) {
      fetchPeopleData();
    }
  }, [session, status]);

  console.log(session?session.user:null);

  const fetchPeopleData = async () => {
    try {
      const response = await fetch('/api/admin/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: session.user.department }),
      });
      if (response.ok) {
        const data = await response.json();
        setPeopleData(data);
      } else {
        console.error('Failed to fetch people data');
      }
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  };

  const handleAccessChange = async (id, newApprovalStatus) => {
    try {
      const response = await fetch('/api/admin/updateAccess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: newApprovalStatus }),
      });

      if (response.ok) {
        setPeopleData(peopleData.map(person => 
          person._id === id ? { ...person, isApproved: newApprovalStatus } : person
        ));
      } else {
        console.error('Failed to update access');
      }
    } catch (error) {
      console.error('Error updating access:', error);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center my-10">
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
                <th className="py-3 px-6 text-left">Approval Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {peopleData.map((person) => (
                <tr key={person._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={person.imageUrl || defaultImageUrl}
                      alt={person.name || 'Default User'}
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{person.name}</td>
                  <td className="py-3 px-6 text-left">{person.email}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 rounded ${person.isApproved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {person.isApproved ? 'Approved' : 'Not Approved'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {person.isApproved ? (
                      <button
                        onClick={() => handleAccessChange(person._id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAccessChange(person._id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
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
