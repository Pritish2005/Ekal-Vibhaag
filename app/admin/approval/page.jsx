'use client';

import { set } from 'mongoose';
import { useState, useEffect } from 'react';

export default function AdminApprovalPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/pending');
        const data = await res.json();

        if (res.ok) {
          setPendingUsers(data.pendingUsers);
          setLoading(false);
        } else {
          setError('Failed to fetch pending users');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while fetching pending users');
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (userId) => {
    console.log("Approving user with ID:", userId);
  
    const res = await fetch('/api/admin/approve', {  // No userId in the URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),  // Send userId in request body
    });
  
    if (res.ok) {
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
    } else {
      const errorData = await res.json();
      setError(`Failed to approve user: ${errorData.message}`);
      console.error('Error approving user:', errorData);
    }
  };  

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Pending User Approvals</h1>
      <ul>
        {loading? <p>Loading...</p> : pendingUsers.length > 0 ? (
          pendingUsers.map((user) => (
             <li key={user._id}>
              {user.email} - {user.department}
              <button onClick={() => approveUser(user._id)}>Approve</button>
            </li>
          ))
        ) : (
          <p>No users pending approval.</p>
        )}
      </ul>
    </div>
  );
}
