import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ms } from "date-fns/locale"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ActivityProps {
  params: {
    id: string
  }
}

async function getActivity(id: string) {
  // TODO: Replace with actual API call
  // This is mock data for now
  return {
    id,
    nama: "Majlis Graduasi 2025",
    tarikh: new Date(),
    tempat: "Dewan Al-Khairiah",
    penerangan: "Majlis graduasi pelajar-pelajar tahfiz yang telah berjaya menamatkan pengajian mereka.",
    gambarUtama: "/placeholder.svg",
    media: [
      { id: "1", jenis: "gambar", url: "/placeholder.svg", caption: "Ucapan Pengetua" },
      { id: "2", jenis: "gambar", url: "/placeholder.svg", caption: "Penyampaian Sijil" },
      { id: "3", jenis: "video", url: "https://example.com/video.mp4", caption: "Persembahan Nasyid" },
      { id: "4", jenis: "gambar", url: "/placeholder.svg", caption: "Sesi Bergambar" },
      { id: "5", jenis: "gambar", url: "/placeholder.svg", caption: "Jamuan" },
    ],
  }
}

export default async function ActivityPage({ params }: ActivityProps) {
  const activity = await getActivity(params.id)

  if (!activity) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-emerald-800 mb-6">{activity.nama}</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-[400px] w-full">
              <Image
                src={activity.gambarUtama}
                alt={activity.nama}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-6">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {format(activity.tarikh, "d MMMM yyyy", { locale: ms })}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{activity.tempat}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 whitespace-pre-wrap">{activity.penerangan}</p>
              
              <div className="border-t pt-6 space-y-6">
                <h2 className="text-2xl font-semibold text-emerald-800">Galeri Media</h2>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {activity.media.map((item) => (
                      <CarouselItem key={item.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                            {item.jenis === "gambar" ? (
                              <Image
                                src={item.url}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <video
                                src={item.url}
                                controls
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <p className="mt-2 text-sm text-center text-gray-600">{item.caption}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
