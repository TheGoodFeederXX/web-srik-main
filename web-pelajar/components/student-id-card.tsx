"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Download, Printer } from "lucide-react"

interface StudentIdCardProps {
  student: {
    student_id: string
    name: string
    ic_number?: string | null
    birth_date?: string | null
    address?: string | null
    avatar_url?: string | null
  }
}

export function StudentIdCard({ student }: StudentIdCardProps) {
  const idCardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handlePrint = () => {
    if (idCardRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Kad Pelajar - ${student.name}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .card-container { width: 85.6mm; height: 54mm; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="card-container">
                ${idCardRef.current.outerHTML}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const handleDownload = () => {
    toast({
      title: "Muat Turun Kad Pelajar",
      description: "Fungsi muat turun kad pelajar akan datang.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kad Pengenalan Pelajar</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Muat Turun
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          ref={idCardRef}
          className="w-[85.6mm] h-[54mm] bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          <div className="flex h-full">
            <div className="w-1/3 bg-green-700 flex flex-col items-center justify-between py-4 px-2">
              <div className="flex flex-col items-center">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Sekolah Rendah Islam Al-Khairiah"
                  width={50}
                  height={50}
                  className="mb-2"
                />
                <h3 className="text-white text-xs font-bold text-center">SEKOLAH RENDAH ISLAM AL-KHAIRIAH</h3>
              </div>
              <Avatar className="h-20 w-20 border-2 border-white">
                <AvatarImage src={student.avatar_url || ""} alt={student.name} />
                <AvatarFallback className="text-lg bg-green-100 text-green-700">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-white text-[8px] text-center">
                <p>KAD INI ADALAH HAKMILIK SEKOLAH</p>
                <p>JIKA JUMPA SILA PULANGKAN KEPADA:</p>
                <p className="font-bold">SEKOLAH RENDAH ISLAM AL-KHAIRIAH</p>
              </div>
            </div>
            <div className="w-2/3 p-3 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-green-700 mb-2">KAD PELAJAR</h2>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-gray-600">Nama:</span>
                    <span className="col-span-2 font-medium">{student.name}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-gray-600">No. Pelajar:</span>
                    <span className="col-span-2 font-medium">{student.student_id}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-gray-600">No. K/P:</span>
                    <span className="col-span-2 font-medium">{student.ic_number || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-gray-600">Tarikh Lahir:</span>
                    <span className="col-span-2 font-medium">
                      {student.birth_date ? new Date(student.birth_date).toLocaleDateString("ms-MY") : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-[8px] text-gray-500">
                  <p>Sah sehingga 31 Disember 2025</p>
                </div>
                <div className="text-[8px] text-center">
                  <div className="border-b border-black w-16 mb-1"></div>
                  <p>Pengetua</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
