import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';

export const GET = async () => {
  await connectToDatabase();

  const pendingUsers = await User.find({ isAdmin: false, isApproved: false });

  return new Response(JSON.stringify({ pendingUsers }), { status: 200 });
};
