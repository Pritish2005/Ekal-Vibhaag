import { getSession } from 'next-auth/react';
import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';

export const GET = async (req) => {
  const session = await getSession({ req });

  if (!session) {
    return new Response(JSON.stringify({ isApproved: false }), { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  return new Response(JSON.stringify({ isApproved: user.isApproved }), { status: 200 });
};
