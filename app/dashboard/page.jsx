'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useSession } from "next-auth/react"; // Import useSession
import { app } from '../../lib/firebaseConfig.js';
import SimpleImageSlider from "react-simple-image-slider";

function Dashboard() {
  const db = getFirestore(app);
  const router = useRouter();

  const { data: session, status } = useSession(); // Access session data
  console.log('session data:',session ? session.user: null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Image URLs for the slider
  const images = [
    {
      url: "https://parivahan.gov.in/parivahan//sites/default/files/banner-swachhata-hi-seva.jpg",
    },
    {
      url: "https://parivahan.gov.in/parivahan//sites/default/files/banner-english-digital-india-awards-2022-option-3.jpg",
    },
    {
      url: "https://mp.gov.in/uploads/slider/HarGharTiranga17235434931582717570.jpeg",
    },
  ];

  // Fetch tasks when session is available
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while loading
    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, 'tasks');
        const q = query(
          tasksRef,
          where("department", "==", session.user.department), // Filter by department
          orderBy("startDate", "desc"),  // Sort by startDate in descending order
          limit(3)  // Limit to 3 tasks
        );
        const querySnapshot = await getDocs(q);
        const fetchedTasks = [];

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          fetchedTasks.push({
            id: doc.id,
            description: task.taskDescription,
            name: task.taskName,
            latitude: task.latitude,
            longitude: task.longitude,
            startDate: task.startDate.toDate(),  // Convert Timestamp to date
            endDate: task.endDate.toDate()  // Convert Timestamp to date
          });
        });

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [db, session, status, router]);

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      {/* User Info */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div className="flex items-center">
          <div className="ml-4">
            <h1 className="text-lg font-bold">
              Welcome, {session ? session.user.email : "Loading..."}
            </h1>
            {session && <p>Department: {session.user.department}</p>}
          </div>
        </div>

        {/* Button on the right side */}
        <div className="mr-4">
          <button
            onClick={() => {
              // Handle chat button click, e.g., redirect to chat page
              router.push("/admin"); // Ensure you have the useRouter hook imported
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Admin Window
          </button>
        </div>
      </div>

      {/* Image Slider
      <div className="mt-5 mb-8 flex justify-center">
        <SimpleImageSlider
          width={'90%'}
          height={200}
          images={images}
          showBullets={true}
          showNavs={true}
        />
      </div> */}
      {/* Image Slider */}
      <div className="mt-5 mb-8 flex justify-center">
        <SimpleImageSlider
          width={"90%"}
          height={300}
          images={images.map((image) => ({
            ...image,
            // Add style to control how the image fits
            style: {
              objectFit: "cover", // Use 'cover' if you want to maintain aspect ratio and fill the space
              width: "100%", // Ensure the image takes full width
              height: "100%", // Ensure the image takes full height
            },
          }))}
          showBullets={true}
          showNavs={true}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-15 text-center">
        <div className="flex justify-center gap-4">
          <button
            className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
            onClick={() => router.push("/dashboard/addtask")}
          >
            Add Task
          </button>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            onClick={() => router.push("/dashboard/viewtasks")}
          >
            View All Tasks
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => router.push("/dashboard/postblog")}
          >
            Post Blog
          </button>
          <button
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
            onClick={() => router.push("/dashboard/pendingprojects")}
          >
            Pending Projects
          </button>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center">Latest Tasks</h2>
        {loading ? (
          <p className="text-center mt-4">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
                  onClick={() => router.push(`/dashboard/addtask/${task.id}`)} // Link to task dashboard
                >
                  <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Location:</strong> {task.latitude}, {task.longitude}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Start:</strong>{" "}
                    {task.startDate.toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>End:</strong> {task.endDate.toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">No tasks available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
