"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for posts - in a real application, this would come from an API or database
const posts = [
  {
    id: 1,
    title: "Program Tahfiz Al-Quran",
    excerpt:
      "Program hafazan Al-Quran untuk pelajar yang berminat menghafaz Al-Quran dengan bimbingan guru tahfiz yang berkelayakan.",
    content:
      "Program Tahfiz Al-Quran di Sekolah Rendah Islam Al-Khairiah bertujuan untuk melahirkan generasi huffaz yang berakhlak mulia dan cemerlang dalam akademik. Program ini dikendalikan oleh guru-guru tahfiz yang berkelayakan dan berpengalaman dalam bidang hafazan Al-Quran.\n\nPelajar akan dibimbing untuk menghafaz Al-Quran mengikut kaedah yang berkesan dan sistematik. Selain itu, pelajar juga akan diajar tentang tajwid, tafsir dan adab-adab berinteraksi dengan Al-Quran.\n\nProgram ini terbuka kepada semua pelajar yang berminat untuk menghafaz Al-Quran. Pelajar akan dibahagikan kepada beberapa kumpulan mengikut tahap kemampuan mereka. Setiap kumpulan akan dibimbing oleh seorang guru tahfiz yang akan memantau perkembangan hafazan pelajar.\n\nPelajar yang berjaya menghafaz beberapa juzuk Al-Quran akan diberi pengiktirafan khas semasa Majlis Graduasi Tahunan sekolah. Ini bertujuan untuk memberi motivasi kepada pelajar untuk terus menghafaz Al-Quran.",
    image: "/placeholder.svg?height=600&width=800",
    date: "15 Mei 2023",
  },
  {
    id: 2,
    title: "Program Bahasa Arab",
    excerpt: "Program pembelajaran Bahasa Arab untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar.",
    content:
      "Program Bahasa Arab di Sekolah Rendah Islam Al-Khairiah bertujuan untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar. Program ini merangkumi pembelajaran tatabahasa Arab, perbualan, penulisan dan pembacaan.\n\nPelajar akan didedahkan dengan kaedah pembelajaran yang interaktif dan menyeronokkan untuk menguasai Bahasa Arab. Aktiviti seperti pertandingan bercerita, syair dan nasyid dalam Bahasa Arab turut diadakan untuk meningkatkan minat dan keyakinan pelajar dalam menggunakan Bahasa Arab.\n\nProgram ini dikendalikan oleh guru-guru yang berkelayakan dan berpengalaman dalam pengajaran Bahasa Arab. Pelajar akan dibahagikan kepada beberapa kumpulan mengikut tahap kemampuan mereka untuk memastikan proses pembelajaran yang lebih berkesan.\n\nSelain itu, sekolah juga mengadakan Minggu Bahasa Arab setiap tahun di mana pelbagai aktiviti berkaitan Bahasa Arab diadakan. Ini termasuk pertandingan menulis khat, bercerita, berpuisi dan sebagainya. Program ini bertujuan untuk memupuk minat dan cinta pelajar terhadap Bahasa Arab.",
    image: "/placeholder.svg?height=600&width=800",
    date: "20 Jun 2023",
  },
  {
    id: 3,
    title: "Program Sukan dan Rekreasi",
    excerpt: "Program sukan dan rekreasi untuk memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan pelajar.",
    content:
      "Program Sukan dan Rekreasi di Sekolah Rendah Islam Al-Khairiah bertujuan untuk memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan pelajar. Program ini merangkumi pelbagai aktiviti sukan seperti bola sepak, bola jaring, badminton, ping pong dan sebagainya.\n\nSelain itu, aktiviti rekreasi seperti perkhemahan, eksplorasi alam dan aktiviti luar turut diadakan untuk membina kecergasan fizikal, mental dan sosial pelajar. Program ini juga bertujuan untuk memupuk nilai-nilai murni seperti semangat berpasukan, disiplin dan ketahanan diri.\n\nSekolah mengadakan Hari Sukan Tahunan di mana pelajar akan bertanding dalam pelbagai acara sukan. Ini memberi peluang kepada pelajar untuk mempamerkan bakat dan kemahiran mereka dalam bidang sukan. Selain itu, ia juga memupuk semangat kesukanan dan persaingan sihat dalam kalangan pelajar.\n\nProgram ini dikendalikan oleh guru-guru yang berkelayakan dan berpengalaman dalam bidang sukan dan rekreasi. Pelajar akan dibimbing untuk mengamalkan gaya hidup sihat dan aktif melalui penyertaan dalam aktiviti sukan dan rekreasi.",
    image: "/placeholder.svg?height=600&width=800",
    date: "10 Jul 2023",
  },
]

export default function PostDetail() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch the post data from an API
    const postId = Number.parseInt(params.id)
    const foundPost = posts.find((p) => p.id === postId)

    if (foundPost) {
      setPost(foundPost)
    } else {
      // Redirect to posts page if post not found
      router.push("/posts")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/posts" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Senarai Berita & Aktiviti
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative h-64 md:h-96 w-full">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{post.date}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">{post.title}</h1>

            <div className="prose max-w-none text-gray-700">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
