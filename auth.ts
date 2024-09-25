import NextAuth from "next-auth"
import CredentiatlsProvider from "next-auth/providers/credentials"

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentiatlsProvider({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "john.doe@example.com",
          },
          password: {
            label: "Password",
            type: "password",
          },
          department: {
            label: "Department",
            type: "text",
            placeholder: "Department",
          },
        },
      })
  ],
})