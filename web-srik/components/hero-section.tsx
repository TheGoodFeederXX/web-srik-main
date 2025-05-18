"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function HeroSection() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) => {
    return `${pos * 20}%`
  })

  return (
    <section 
      ref={targetRef}
      className="relative overflow-hidden min-h-screen flex items-center py-20 md:py-32">        {/* Hero Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y: useScroll().scrollY,
          scale: 1.1,
        }}
      >
        <Image 
          src="https://db-pic.thegoodfeeder.xyz/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Enhanced gradient overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-800/60 to-emerald-900/70"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </motion.div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            style={{ opacity, scale, y: position }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Pendidikan Islam <span className="text-emerald-300">Berkualiti</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-200 max-w-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Membentuk generasi berilmu, berakhlak mulia dan berdaya saing dalam persekitaran pembelajaran yang
              kondusif.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white">
                Daftar Sekarang
              </Button>
                <Button size="lg" variant="outline" className="border-white text-white bg-black hover:bg-black/80">
                Ketahui Lebih Lanjut
                </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
              src="https://db-pic.thegoodfeeder.xyz/heroA.jpg?height=800&width=600"
              alt="Sekolah Rendah Islam Al-Khairiah"
              fill
              className="object-cover"
              />
              {/* Dissolving border effect */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                background: "radial-gradient(ellipse at center, transparent 60%, rgba(16, 185, 129, 0.15) 100%)"
              }}
              />
              <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
              style={{
                maskImage: "radial-gradient(ellipse at center, white 70%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, white 70%, transparent 100%)",
                background: "rgba(255,255,255,0.05)"
              }}
              />
            </div>

            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-emerald-800">Pendidikan Berkualiti</p>
                  <p className="text-sm text-gray-500">Kurikulum Terbaik</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-emerald-800">Persekitaran Selamat</p>
                  <p className="text-sm text-gray-500">Pembelajaran Kondusif</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-emerald-200 opacity-20"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-emerald-300 opacity-20"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 7,
        }}
      />
    </section>
  )
}
