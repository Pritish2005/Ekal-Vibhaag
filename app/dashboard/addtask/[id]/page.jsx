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
      // Log task and conflicting tasks
      console.log('Generating optimal schedule for task:', task);
      console.log('Conflicting tasks:', conflictingTasks);

      const conflictDetails = conflictingTasks.map((conflict) => ({
          description: conflict.description,
          department: conflict.department,
          startDate: conflict.startDate,
          endDate: conflict.endDate,
          latitude: conflict.latitude,
          longitude: conflict.longitude
      }));

      // Log conflict details
      console.log('Conflict details:', conflictDetails);

      // Build the prompt for Gemini API based on task and conflicts
      const schedulePrompt = `You are an AI tasked with optimizing schedules for tasks that have location and date conflicts. 
      Task: ${task.taskName}, Department: ${task.department}, Description: ${task.taskDescription}, Location: ${task.latitude}, ${task.longitude}.
      Conflicting Tasks: ${JSON.stringify(conflictDetails)}. 
      Please suggest the best order of execution for these tasks to avoid conflicts, minimize downtime, and maintain the original task durations.
      
      Your response should be in pure JSON format, without any markdown. The JSON should contain an array of tasks, each with:
      - taskName: The name of the task
      - department: The department handling the task
      - newStartDate: The optimized start date (without changing the task duration)
      - newEndDate: The optimized end date`;
      // Log prompt before sending it
      console.log('Schedule prompt:', schedulePrompt);
      // Simulate Gemini API response (replace with actual API call)
      const res = await chatSession.sendMessage(schedulePrompt);

      // Log response
      console.log('Raw response from Gemini API:', res);

      const mockJsonResp = res.response.text().replace('```json', '').replace('```', ''); // Clean up the response
      
      // Log cleaned-up response
      console.log('Cleaned-up JSON response:', mockJsonResp);

      const jsonFeedbackResponse = JSON.parse(mockJsonResp);

      // Log parsed JSON response
      console.log('Parsed JSON feedback response:', jsonFeedbackResponse);

      // Save the optimized schedule from Gemini API
      setOptimizedSchedule(jsonFeedbackResponse);

      // Log optimized schedule
      console.log('Optimized schedule:', jsonFeedbackResponse);
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
    <div>
      <h1 className='text-2xl'>Task Details</h1>
      {taskData ? (
        <div className="p-4 bg-gray-100 rounded shadow">
          <p><strong>Task Name:</strong> {taskData.taskName}</p>
          <p><strong>Description:</strong> {taskData.taskDescription}</p>
          <p><strong>Department:</strong> {taskData.department}</p>
          <p><strong>Start Date:</strong> {taskData.startDate}</p>
          <p><strong>End Date:</strong> {taskData.endDate}</p>
          <p><strong>Collaborator:</strong> {taskData.collaborator ? taskData.collaborator : "None"}</p>
          <p><strong>Latitude:</strong> {taskData.latitude}</p>
          <p><strong>Longitude:</strong> {taskData.longitude}</p>

          {/* Display the optimized schedule */}
          {optimizedSchedule && (
            <div className="mt-4 bg-blue-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Optimized Schedule:</h3>
              <ul className="list-disc list-inside">
                {optimizedSchedule.map((scheduleItem, idx) => (
                  <li key={idx}>
                    <p><strong>Task Name:</strong> {scheduleItem.taskName}</p>
                    <p><strong>Department:</strong> {scheduleItem.department}</p>
                    <p><strong>New Start Date:</strong> {scheduleItem.newStartDate}</p>
                    <p><strong>New End Date:</strong> {scheduleItem.newEndDate}</p>
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
