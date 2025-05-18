"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const features = [
    "Kurikulum Pendidikan Islam Komprehensif",
    "Tenaga Pengajar Berkelayakan & Berpengalaman",
    "Kemudahan Pembelajaran Moden",
    "Aktiviti Ko-Kurikulum Seimbang",
    "Persekitaran Pembelajaran Kondusif",
    "Penekanan Pada Akhlak & Nilai Murni",
  ]

  return (
    <section id="about" className="relative py-24" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://db-pic.thegoodfeeder.xyz/hero2.jpg"
          alt="Background Tentang Kami"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/70 via-emerald-900/60 to-emerald-950/75"></div>
        {/* Additional subtle overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tentang Kami</h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto mb-8"></div>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Sekolah Rendah Islam Al-Khairiah menawarkan pendidikan berkualiti yang menggabungkan kurikulum akademik dan
            pendidikan Islam untuk melahirkan generasi sahsiah dan intelektual Islam.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="https://db-pic.thegoodfeeder.xyz/heroB.jpeg?height=800&width=600"
                alt="Tentang Sekolah Rendah Islam Al-Khairiah"
                fill
                className="object-cover"
                loading="eager"
              />
            </div>

            <motion.div
              className="absolute -bottom-8 -right-8 bg-emerald-500/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white border border-emerald-400/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-3xl font-bold">Sejak</p>
              <p className="text-4xl font-bold">2018</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Membentuk Generasi Sahsiah dan Intelektual Islam
            </h3>
            <p className="text-gray-200 text-lg">
              Sekolah Rendah Islam Al-Khairiah ditubuhkan pada tahun 2018 dengan matlamat untuk menyediakan pendidikan
              berkualiti yang menggabungkan kurikulum akademik dan pendidikan Islam. Kami komited untuk melahirkan
              generasi yang cemerlang dalam akademik, berakhlak mulia dan mempunyai jati diri yang kukuh.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-1 group-hover:text-emerald-300 transition-colors" />
                  <span className="text-gray-200 group-hover:text-white transition-colors">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
