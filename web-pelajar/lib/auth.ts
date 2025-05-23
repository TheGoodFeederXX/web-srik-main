import type { NextAuthOptions, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { cookies } from "next/headers"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "sso",
      name: "SRIK SSO",
      credentials: {},
      async authorize(credentials, req) {
        const ssoToken = req?.query?.sso_token;
        if (!ssoToken) return null;

        // Verify token with web-srik
        const response = await fetch(`${process.env.NEXT_PUBLIC_SSO_SERVER}/api/auth/sso/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: ssoToken }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.user;
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Akaun SRIA",
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

        // Use standardized admin client implementation
        const supabase = createAdminClient()

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
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

