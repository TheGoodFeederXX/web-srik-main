import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image 
            src="/logo.png" 
            alt="SRI Al-Khairiah Logo" 
            width={100} 
            height={100} 
            className="h-20 w-auto" 
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Sistem Pentadbiran SRI Al-Khairiah
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Log masuk untuk mengakses sistem pentadbiran
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Log Masuk</CardTitle>
            <CardDescription>
              Masukkan maklumat log masuk anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
      </div>
    </div>
  )
}
