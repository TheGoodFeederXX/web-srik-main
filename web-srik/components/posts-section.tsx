"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
]

export default function PostsSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="posts" className="relative py-20 bg-gradient-to-b from-white to-emerald-50" ref={ref}>
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/30 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-200/20 blur-3xl"></div>
      </div>
      <div className="container relative mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Berita & Aktiviti</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti perkembangan terkini tentang aktiviti dan program yang dijalankan di Sekolah Rendah Islam Al-Khairiah.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card 
                variant="glassLight" 
                className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-white/40">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                  <CardTitle className="text-xl text-emerald-800">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={`/posts/${post.id}`} passHref>
                    <Button variant="link" className="p-0 text-emerald-600 hover:text-emerald-700">
                      Baca Selanjutnya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/posts" passHref>
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Lihat Semua Berita & Aktiviti
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
