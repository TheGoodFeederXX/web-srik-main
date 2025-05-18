import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=50&width=50"
              alt="Sekolah Rendah Islam Al-Khairiah"
              width={50}
              height={50}
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold">Sekolah Rendah Islam Al-Khairiah</h1>
          </div>
          <Link href="/login">
            <Button>Log Masuk</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Selamat Datang ke Portal Pelajar</h2>
            <p className="text-gray-600 mb-8">Portal rasmi untuk pelajar dan waris Sekolah Rendah Islam Al-Khairiah</p>
            <div className="flex justify-center">
              <Link href="/login">
                <Button size="lg" className="mr-4">
                  Log Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Maklumat Pelajar</h3>
              <p className="text-gray-600">Akses maklumat peribadi pelajar dan kad pengenalan pelajar.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Maklumat Akademik</h3>
              <p className="text-gray-600">Semak kelas, jadual dan keputusan peperiksaan pelajar.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Permohonan Cuti</h3>
              <p className="text-gray-600">Mohon cuti dan semak status permohonan cuti pelajar.</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Sekolah Rendah Islam Al-Khairiah. Hak Cipta Terpelihara.</p>
        </div>
      </footer>
    </div>
  )
}
