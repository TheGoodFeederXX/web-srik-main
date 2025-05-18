"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function GallerySection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const activities = [
    {
      id: "1",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Aktiviti Pelajar",
      caption: "Aktiviti Pelajar",
      date: "2025-01-15",
      place: "Dewan Al-Khairiah",
    },
    {
      id: "2",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Program Tahfiz",
      caption: "Program Akademi Pembangunan Murid",
      date: "2025-02-20",
      place: "Surau Al-Khairiah",
    },
    {
      id: "3",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Sukan Tahunan",
      caption: "Sukan Tahunan",
      date: "2025-03-10",
      place: "Padang SRIK",
    },
    {
      id: "4",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Kelas Pembelajaran",
      caption: "Kelas Pembelajaran",
      date: "2025-04-05",
      place: "Bilik Darjah SRIK",
    },
    {
      id: "5",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Majlis Graduasi",
      caption: "Majlis Graduasi",
      date: "2025-05-20",
      place: "Dewan Al-Khairiah",
    },
    {
      id: "6",
      src: "/placeholder.svg?height=600&width=800",
      alt: "Aktiviti Kokurikulum",
      caption: "Aktiviti Kokurikulum",
      date: "2025-06-01",
      place: "Gelanggang SRIK",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <section id="gallery" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Galeri Kami</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lihat koleksi gambar aktiviti dan program yang dijalankan di Sekolah Rendah Islam Al-Khairiah.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <Link href={`/aktiviti/${activity.id}`} key={activity.id}>
              <motion.article
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="cursor-pointer group"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={activity.src || "/placeholder.svg"}
                    alt={activity.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/40 transition-colors duration-300 flex items-end">
                    <div className="p-4 w-full bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-medium mb-1">{activity.caption}</h3>
                      <p className="text-white/80 text-sm">{activity.place}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
