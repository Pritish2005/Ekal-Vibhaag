import connect from "../../../../utils/db.js";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Log entry point
    console.log("Request received");

    // Parse the request body
    const { department } = await request.json();
    console.log("Department:", department);

    // Validate department
    if (!department) {
      console.error("Department is missing in the request body.");
      return new NextResponse("Department is required", { status: 400 });
    }

    // Establish database connection
    const db = await connect();
    
    // Fetch users matching the department
    const users = await db.collection("users").find({ department }).toArray();
    console.log("Users fetched:", users);

    // Filter out users with isAdmin: true
    const nonAdminUsers = users.filter(user => !user.isAdmin);
    console.log("Non-admin users:", nonAdminUsers);

    // Return the filtered users in the response
    return new NextResponse(JSON.stringify(nonAdminUsers), {
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching people data:", error);
    return new NextResponse("Failed to fetch people data", { status: 500 });
  }
};
