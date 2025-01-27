import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const result = await pool.query("SELECT id, email, name, password, is_subscribed FROM users WHERE email = $1", [
          credentials.email,
        ])

        const user = result.rows[0]

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isSubscribed: user.is_subscribed,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isSubscribed = user.isSubscribed
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.isSubscribed = token.isSubscribed
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

