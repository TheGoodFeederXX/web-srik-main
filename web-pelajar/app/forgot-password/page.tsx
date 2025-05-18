import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=50&width=50"
            alt="Sekolah Rendah Islam Al-Khairiah"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
          <h1 className="text-xl font-bold">Sekolah Rendah Islam Al-Khairiah</h1>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Lupa Kata Laluan</h2>
            <p className="text-gray-600">Masukkan email anda untuk menetapkan semula kata laluan</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
