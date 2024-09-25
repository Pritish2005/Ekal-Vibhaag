'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore'; 
import { app } from '../../../../../lib/firebaseConfig.js';

function Page() {
  const db = getFirestore(app);
  const { id } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [collaboratingDepartments, setCollaboratingDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy data for collaborating departments
  const dummyDepartments = [
    { name: 'Water Department', status: 'Accepted' },
    { name: 'Gas Department', status: 'Pending' },
    { name: 'Electricity Department', status: 'Rejected' },
  ];

  useEffect(() => {
    const fetchTaskAndCollaborators = async () => {
      try {
        if (!id) {
          setError('No task ID provided.');
          setLoading(false);
          return;
        }

        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("id", "==", id.toString()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setTaskData(docData);
          setCollaboratingDepartments(dummyDepartments);
        } else {
          setError('No task found with that ID.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndCollaborators();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
        {taskData && (
          <div>
            <p className="text-gray-700"><strong>Task ID:</strong> {taskData.id}</p>
            <p className="text-gray-700"><strong>Description:</strong> {taskData.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Collaborating Departments</h3>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {collaboratingDepartments.map((dept, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200">{dept.name}</td>
                <td className={`py-2 px-4 border-b border-gray-200 ${dept.status === 'Accepted' ? 'text-green-500' : dept.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {dept.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
