'use client'; // This marks the file as a Client Component

import React from 'react';
import { useSession } from 'next-auth/react';

const UserDetails = () => {
    const { data: session, status } = useSession(); // Access session data and status

    if (status === 'loading') {
        return <div>Loading...</div>; // Show a loading message while checking session
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-bold">Please Login</h1>
                <p className="mt-4">You need to be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center mt-10 text-center">
            <h1 className="text-2xl font-bold">User Details</h1>
            <div className="mt-4 p-4 border rounded shadow-lg">
                <p className="text-lg"><strong>Name:</strong> {session.user.name}</p>
                <p className="text-lg"><strong>Email:</strong> {session.user.email}</p>
                <p className="text-lg"><strong>Department:</strong> {session.user.department}</p>
            </div>
        </div>
    );
};

export default UserDetails;
