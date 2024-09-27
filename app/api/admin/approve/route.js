import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';
import mongoose from 'mongoose';

export const POST = async (req) => {
  try {
    const { userId } = await req.json();  // Extract userId from the request body

    console.log('Received userId:', userId);

    await connectToDatabase();

    // Validate that userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ message: 'Invalid user ID' }), { status: 400 });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Approve the user
    user.isApproved = true;
    await user.save();

    return new Response(JSON.stringify({ message: 'User approved successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error approving user:', error);
    return new Response(JSON.stringify({ message: 'Error approving user' }), { status: 500 });
  }
};
