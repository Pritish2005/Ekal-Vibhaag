import User from '../../../../models/User';
import connect from '../../../../utils/db';

export const POST = async (req) => {
  try {
    const { email } = await req.json(); // Extract email from request body

    // Connect to MongoDB
    await connect();

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Return approval status
    return new Response(
      JSON.stringify({ isApproved: user.isApproved }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking user approval:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
};
