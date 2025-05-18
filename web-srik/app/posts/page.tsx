"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for posts - in a real application, this would come from an API or database
const posts = [
  {
    id: 1,
    title: "Program Tahfiz Al-Quran",
    excerpt:
      "Program hafazan Al-Quran untuk pelajar yang berminat menghafaz Al-Quran dengan bimbingan guru tahfiz yang berkelayakan.",
    image: "/placeholder.svg?height=600&width=800",
    date: "15 Mei 2023",
  },
  {
    id: 2,
    title: "Program Bahasa Arab",
    excerpt: "Program pembelajaran Bahasa Arab untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar.",
    image: "/placeholder.svg?height=600&width=800",
    date: "20 Jun 2023",
  },
  {
    id: 3,
    title: "Program Sukan dan Rekreasi",
    excerpt: "Program sukan dan rekreasi untuk memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan pelajar.",
    image: "/placeholder.svg?height=600&width=800",
    date: "10 Jul 2023",
  },
  {
    id: 4,
    title: "Kelas Pengayaan Akademik",
    excerpt: "Kelas tambahan untuk membantu pelajar meningkatkan prestasi akademik dalam mata pelajaran teras.",
    image: "/placeholder.svg?height=600&width=800",
    date: "5 Ogos 2023",
  },
  {
    id: 5,
    title: "Program Khemah Ibadah",
    excerpt:
      "Program intensif untuk meningkatkan amalan ibadah dan penghayatan Islam dalam kehidupan seharian pelajar.",
    image: "/placeholder.svg?height=600&width=800",
    date: "18 September 2023",
  },
  {
    id: 6,
    title: "Lawatan Pendidikan",
    excerpt: "Lawatan ke tempat-tempat bersejarah dan institusi pendidikan untuk memberi pendedahan kepada pelajar.",
    image: "/placeholder.svg?height=600&width=800",
    date: "22 Oktober 2023",
  },
]

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <section className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://db-pic.thegoodfeeder.xyz/hero2.jpg"
            alt="Posts background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-emerald-800/80 to-emerald-900/90"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-white/90 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Laman Utama
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Berita & Aktiviti</h1>
              <div className="w-20 h-1 bg-emerald-400 mb-6"></div>
              <p className="text-xl text-gray-100 max-w-2xl">
                Ikuti perkembangan terkini tentang aktiviti dan program yang dijalankan di Sekolah Rendah Islam Al-Khairiah.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl text-emerald-800">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-emerald-600 hover:text-emerald-700 inline-flex items-center"
                  >
                    Baca Selanjutnya
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
