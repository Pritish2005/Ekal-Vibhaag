import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../models/User';
import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        if (!user.isApproved) {
          throw new Error('Account pending approval');
        }

        return { email: user.email, isAdmin: user.isAdmin }; // Pass user data to session
      }
    })
  ],
  pages: {
    signIn: '/auth/login', // Custom login page
    error: '/auth/error', // Error page URL
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = token.isAdmin;
      return session;
    }
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
