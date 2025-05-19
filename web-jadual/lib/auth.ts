import type { NextAuthOptions } from "next-auth"
import { cookies } from "next/headers"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "SRIDentiti",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // Verify the email domain is from srialkhairiah.my
        if (!credentials.email.endsWith('@srialkhairiah.my')) {
          throw new Error('Only srialkhairiah.my email addresses are allowed')
        }        
        // Use standardized client implementation
        const supabase = createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !data.user) {
          return null
        }

        // Get profile data
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        return {
          id: data.user.id,
          email: data.user.email,
          name: profileData?.full_name || data.user.email,
          image: profileData?.avatar_url || null,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

