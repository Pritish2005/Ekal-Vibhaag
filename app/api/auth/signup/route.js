import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  const { email, password, department } = await req.json();

  await connectToDatabase();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  const user = new User({
    email,
    password: hashedPassword,
    department,
    isAdmin: false,  // Regular user by default
    isApproved: false,  // Not approved initially
  });

  await user.save();

  return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
};
