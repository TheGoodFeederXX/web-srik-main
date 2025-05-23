import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import { authOptions } from "@/lib/auth"

export default async function LoginPage() {
  // Check if user is already logged in using NextAuth
  const session = await getServerSession(authOptions)

  // If logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="https://db-pic.thegoodfeeder.xyz/logo.png" alt="SRI Al-Khairiah Logo" width={100} height={100} className="h-20 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Aplikasi Jadual SRI Al-Khairiah</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Log masuk untuk mengakses sistem pengurusan jadual
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
