"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-emerald-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Sekolah Rendah Islam Al-Khairiah Logo"
                width={60}
                height={60}
                className="h-14 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg leading-tight">Sekolah Rendah Islam</span>
                <span className="font-bold text-emerald-300 text-xl leading-tight">Al-Khairiah</span>
              </div>
            </Link>
            <p className="text-emerald-100">
              Membentuk generasi berilmu, berakhlak mulia dan berdaya saing dalam persekitaran pembelajaran yang
              kondusif.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white">Pautan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-emerald-100 hover:text-white transition-colors">
                  Utama
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-emerald-100 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#programs" className="text-emerald-100 hover:text-white transition-colors">
                  Program
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-emerald-100 hover:text-white transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-emerald-100 hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-white">Hubungi Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span className="text-emerald-100">Jalan Pedu, 06300 Kuala Nerang, Kedah</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-300" />
                <span className="text-emerald-100">04-786 9582</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-300" />
                <span className="text-emerald-100">srialkhairiah@gmail.com</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white">Media Sosial</h3>
            <p className="text-emerald-100">
              Ikuti kami di media sosial untuk mendapatkan maklumat terkini tentang aktiviti dan program sekolah.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com/srialkhairiahofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://instagram.com/srialkhairiah"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://tiktok.com/@srialkhairiah18"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                </svg>
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-emerald-800 py-6 text-center">
          <p className="text-emerald-100">
            &copy; {currentYear} Sekolah Rendah Islam Al-Khairiah. Hak Cipta Terpelihara.
          </p>
        </div>
      </div>
    </footer>
  )
}
