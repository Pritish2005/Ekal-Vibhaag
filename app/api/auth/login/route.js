import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  const { email, password } = await req.json();

  // Connect to MongoDB
  await connectToDatabase();

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }

  // Check if the user is approved
  if (!user.isApproved) {
    return new Response(JSON.stringify({ message: 'Account is pending approval' }), { status: 403 });
  }

  // If everything is good, return success and user info (you could also create a JWT here)
  return new Response(JSON.stringify({ message: 'Login successful', user }), { status: 200 });
};
