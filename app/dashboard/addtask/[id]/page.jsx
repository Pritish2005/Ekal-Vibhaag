'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from '../../../../lib/firebaseConfig.js';
import toast from 'react-hot-toast'; // For notifications
import { chatSession} from '../../../../lib/GeminiAI.js';

function Tasks() {
  const db = getFirestore(app); // Initialize Firestore
  const params = useParams();
  const id = params.id; // Extract the taskId from the URL params
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimizedSchedule, setOptimizedSchedule] = useState(null); // Store optimized schedule

  // Fetch task and run optimizer as soon as the page loads
  useEffect(() => {
    const fetchTaskAndOptimize = async () => {
      try {
        if (!id) {
          setError('No task ID provided.');
          setLoading(false);
          return;
        }

        // Reference to the 'tasks' collection
        const tasksRef = collection(db, "tasks");
        // Query where 'id' matches the id from params
        const q = query(tasksRef, where("id", "==", id.toString()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Fetch the first document
          const docData = querySnapshot.docs[0].data(); 
          setTaskData(docData);

          // Automatically call the AI optimizer to generate an optimal schedule
          if (docData.conflictExists) {
            await generateOptimalSchedule(docData, docData.conflictingTasks);
          }
        } else {
          setError('No task found with that ID.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndOptimize();
  }, [id, db]);

  // Function to interact with Gemini API to resolve conflicts
  const generateOptimalSchedule = async (task, conflictingTasks) => {
    setLoading(true);
    try {
      const conflictDetails = conflictingTasks.map((conflict) => ({
        description: conflict.description,
        department: conflict.department,
        startDate: conflict.startDate,
        endDate: conflict.endDate,
        latitude: conflict.latitude,
        longitude: conflict.longitude
      }));

      const schedulePrompt = 
      `You are an AI scheduler optimizing tasks that have potential location and date conflicts. 

      Task A: 
      - Name: ${task.taskName}, 
      - Department: ${task.department}, 
      - Description: ${task.taskDescription}, 
      - Location: ${task.latitude}, ${task.longitude}, 
      - Start Date: ${task.startDate}, 
      - End Date: ${task.endDate}.

      Conflicting Tasks:
      ${JSON.stringify(conflictDetails)}

      Your goal is to determine if a conflict exists between these tasks. A conflict exists only if the tasks:
      - Belong to departments that may interfere with each other (e.g., water vs. road maintenance), 
      - Have overlapping descriptions suggesting resource or location conflicts.

      If a conflict exists, propose an optimized schedule. The schedule must:
      - Maintain the task duration for each task.
      - Reorder the tasks to avoid conflict by adjusting start and end dates. For example, Task B should be scheduled before Task A if their original dates overlap, ensuring minimal downtime.

      If no conflict exists (e.g., departments or descriptions suggest no interference), return the tasks in their original schedule.

      If there is even slight chances of conflict, then optimize it.

      Your response should be in pure JSON format, without any markdown. The JSON should contain an array of tasks, each with:
      - taskName: The name of the task
      - department: The department handling the task
      - newStartDate: The optimized start date (only if needed to avoid conflict, else retain original date)
      - newEndDate: The optimized end date (retain the original duration).
      - reason: The reasoning for changing or not changing the task schedule.`;

      const res = await chatSession.sendMessage(schedulePrompt);

      const mockJsonResp = res.response.text().replace('```json', '').replace('```', ''); // Clean up the response
      const jsonFeedbackResponse = JSON.parse(mockJsonResp);
      setOptimizedSchedule(jsonFeedbackResponse);
    } catch (error) {
      console.error('Error generating optimal schedule:', error);
      toast('Error generating optimal schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>Task Details</h1>
      {taskData ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            <p><strong>Task Name:</strong> {taskData.taskName}</p>
            <p><strong>Description:</strong> {taskData.taskDescription}</p>
            <p><strong>Department:</strong> {taskData.department}</p>
            <p><strong>Start Date:</strong> {taskData.startDate}</p>
            <p><strong>End Date:</strong> {taskData.endDate}</p>
            <p><strong>Collaborator:</strong> {taskData.collaborator ? taskData.collaborator : "None"}</p>
            <p><strong>Latitude:</strong> {taskData.latitude}</p>
            <p><strong>Longitude:</strong> {taskData.longitude}</p>
          </div>

          {/* Display the optimized schedule */}
          {optimizedSchedule && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Optimized Schedule:</h3>
              <ul className="space-y-4 mt-2">
                {optimizedSchedule.map((scheduleItem, idx) => (
                  <li key={idx} className="bg-white p-4 shadow-md rounded">
                    <p><strong>Task Name:</strong> {scheduleItem.taskName}</p>
                    <p><strong>Department:</strong> {scheduleItem.department}</p>
                    <p><strong>New Start Date:</strong> {scheduleItem.newStartDate}</p>
                    <p><strong>New End Date:</strong> {scheduleItem.newEndDate}</p>
                    <p><strong>Reason:</strong> {scheduleItem.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No task data to display.</p>
      )}
    </div>
  );
}

export default Tasks;
