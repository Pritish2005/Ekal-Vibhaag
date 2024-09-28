import connect from "../../../../utils/db.js";
import { ObjectId } from 'mongodb';
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { id, isApproved } = await request.json();

    if (!id || isApproved === undefined) {
      console.error('Invalid request body:', { id, isApproved });
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const db = await connect();
    console.log('Connected to database');

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isApproved } }
    );

    console.log('Result of update operation:', result);

    if (result.modifiedCount === 1) {
      return new NextResponse("Access updated successfully", { status: 200 });
    } else {
      console.error('User not found:', { id });
      return new NextResponse("User not found", { status: 404 });
    }
  } catch (error) {
    console.error('Error updating access:', error);
    return new NextResponse("Failed to update access", { status: 500 });
  }
};
