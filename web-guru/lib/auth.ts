import type { NextAuthOptions } from "next-auth"
import { cookies } from "next/headers"
import CredentialsProvider from "next-auth/providers/credentials"
import { createServerClient } from "@supabase/ssr"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const cookieStore = cookies()
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value
              },
              set(name: string, value: string, options: any) {
                cookieStore.set({ name, value, ...options })
              },
              remove(name: string, options: any) {
                cookieStore.set({ name, value: "", ...options })
              },
            },
          },
        )

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
    signIn: "/",
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

export async function getSession() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Get profile data
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: profileData?.full_name || session.user.email,
      image: profileData?.avatar_url || null,
    },
  }
}
