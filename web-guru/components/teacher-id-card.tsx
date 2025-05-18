"use client"

import type { User } from "next-auth"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { TeacherDetails } from "@/types/teacher"

interface TeacherIdCardProps {
  user: User
  teacherDetails?: TeacherDetails | null
}

export function TeacherIdCard({ user, teacherDetails }: TeacherIdCardProps) {
  if (!teacherDetails) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Sila lengkapkan maklumat peribadi anda untuk menjana kad pengenalan guru.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-green-700 text-white p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 relative">
              <Image src="/logo.png" alt="Logo Sekolah Rendah Islam Al-Khairiah" fill className="object-contain" />
            </div>
          </div>
          <h2 className="text-lg font-bold">SEKOLAH RENDAH ISLAM AL-KHAIRIAH</h2>
          <p className="text-xs">MEMBINA SAHSIAH & INTELEKTUAL ISLAM</p>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0 flex justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden relative">
                {user.image ? (
                  <Image src={user.image || "/placeholder.svg"} alt={user.name || ""} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Tiada Gambar</div>
                )}
              </div>
            </div>
            <div className="flex-grow space-y-2">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-gray-500">{teacherDetails.teacher_id}</p>
              </div>
              <div className="grid grid-cols-1 gap-1 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">No. Kad Pengenalan:</span>
                  <span>{teacherDetails.ic_number}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Tarikh Lahir:</span>
                  <span>{new Date(teacherDetails.date_of_birth).toLocaleDateString("ms-MY")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Alamat:</span>
                  <span className="text-xs">{teacherDetails.home_address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
            <p>Kad ini adalah hak milik Sekolah Rendah Islam Al-Khairiah</p>
            <p>Jika dijumpai, sila kembalikan ke alamat sekolah</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
