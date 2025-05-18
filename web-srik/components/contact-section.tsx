"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      details: "Jalan Pedu, 06300 Kuala Nerang, Kedah",
    },
    {
      icon: Phone,
      title: "Telefon",
      details: "04-786 9582",
    },
    {
      icon: Mail,
      title: "Emel",
      details: "srialkhairiah@gmail.com",
    },
  ]

  const socialMedia = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://facebook.com/srialkhairiahofficial",
      color: "bg-blue-500",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://instagram.com/srialkhairiah",
      color: "bg-pink-600",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-emerald-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Hubungi Kami</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami sentiasa bersedia untuk menjawab sebarang pertanyaan anda. Hubungi kami melalui maklumat di bawah atau
            isi borang pertanyaan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-emerald-800">Maklumat Perhubungan</h3>

            <div className="grid gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <item.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800">{item.title}</h4>
                    <p className="text-gray-600">{item.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-emerald-800">Media Sosial</h4>
              <div className="flex gap-3">
                {socialMedia.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${item.color} p-3 rounded-full text-white hover:opacity-90 transition-opacity`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.name}</span>
                  </motion.a>
                ))}
                <motion.a
                  href="https://tiktok.com/@srialkhairiah18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-3 rounded-full text-white hover:opacity-90 transition-opacity"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.a>
              </div>
            </div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d100.63328303543922!3d6.236385950757244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zNsKwMTQnMTEuMCJOIDEwMMKwMzcnNTkuOCJF!5e0!3m2!1sen!2smy!4v1623184029040!5m2!1sen!2smy"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Sekolah Rendah Islam Al-Khairiah"
                  ></iframe>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-emerald-800">Hantar Pertanyaan</h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <Input id="name" placeholder="Nama anda" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Emel
                  </label>
                  <Input id="email" type="email" placeholder="Emel anda" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  No. Telefon
                </label>
                <Input id="phone" placeholder="No. telefon anda" />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subjek
                </label>
                <Input id="subject" placeholder="Subjek pertanyaan" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Mesej
                </label>
                <Textarea id="message" placeholder="Mesej anda" rows={5} />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Hantar Pertanyaan
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
