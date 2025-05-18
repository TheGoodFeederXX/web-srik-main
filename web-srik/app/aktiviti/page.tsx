"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ms } from "date-fns/locale"

// Mock data - replace with actual API call
const activities = [
  {
    id: "1",
    nama: "Aktiviti Pelajar",
    tarikh: new Date("2025-01-15"),
    tempat: "Dewan Al-Khairiah",
    penerangan: "Program mentor mentee antara pelajar senior dan junior.",
    gambarUtama: "/placeholder.svg",
  },
  {
    id: "2",
    nama: "Program Tahfiz",
    tarikh: new Date("2025-02-20"),
    tempat: "Surau Al-Khairiah",
    penerangan: "Majlis khatam Al-Quran pelajar-pelajar tahfiz.",
    gambarUtama: "/placeholder.svg",
  },
  // Add more activities here
]

export default function ActivityListPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">Aktiviti Kami</h1>
          <p className="text-gray-600 mb-8">
            Senarai aktiviti dan program yang telah dijalankan di Sekolah Rendah Islam Al-Khairiah.
          </p>

          <div className="space-y-6">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/aktiviti/${activity.id}`}
                className="block group"
              >
                <article className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <div className="relative h-48 w-full md:h-full md:w-64">
                        <Image
                          src={activity.gambarUtama}
                          alt={activity.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {format(activity.tarikh, "d MMMM yyyy", { locale: ms })}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.tempat}
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600">
                        {activity.nama}
                      </h2>
                      <p className="text-gray-600 line-clamp-2">{activity.penerangan}</p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
