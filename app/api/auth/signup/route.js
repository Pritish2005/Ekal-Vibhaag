import User from "../../../../models/User.js";
import connect from "../../../../utils/db.js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { name, email, password, department } = await request.json();

  if (!name || !email || !password || !department) {
    return new NextResponse("Missing required fields", {
      status: 400,
    });
  }

  await connect();

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    department
  });

  try {
    await newUser.save();
    console.log("New user saved:", newUser); // Add this line for debugging
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    console.error("Error saving user:", err); // Add this line for debugging
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};