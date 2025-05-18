"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function AdministrationSection() {
  return (
    <section id="administration" className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.emerald.700)_1px,transparent_0)] [background-size:40px_40px]" />
        </div>
      </div>
      
      <div className="container relative mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-emerald-600/10 z-10"></div>
              <Image
                src="https://db-pic.thegoodfeeder.xyz/gb.png"
                alt="Ustaz Mohd Fadil Hadi bin Ismail - Guru Besar"
                fill
                className="object-cover object-top transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-2/3 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-3">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-4xl font-bold text-emerald-800"
              >
                Sekapur Sirih
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-xl font-semibold text-emerald-600"
              >
                Ustaz Mohd Fadil Hadi bin Ismail
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="text-md text-emerald-500 font-medium"
              >
                Guru Besar
              </motion.p>
            </div>
            
            <motion.div 
              className="space-y-4 text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-lg">
                Assalamualaikum warahmatullahi wabarakatuh dan salam sejahtera.
              </p>
              <p>
                Alhamdulillah, dengan izin Allah SWT, saya ingin mengucapkan selamat datang ke Sekolah Rendah Islam Al-Khairiah. 
                Sebagai sebuah institusi pendidikan Islam yang unggul, kami berkomitmen untuk membentuk generasi Muslim yang 
                berilmu, berakhlak mulia, dan berdaya saing.
              </p>
              <p>
                Di sekolah kami, kami menggabungkan kurikulum akademik dengan pendidikan Islam secara holistik. Kami percaya 
                bahawa pendidikan bukan sekadar tentang pencapaian akademik, tetapi juga pembentukan sahsiah dan nilai-nilai 
                murni yang berlandaskan Al-Quran dan As-Sunnah.
              </p>
              <p>
                Kami berusaha untuk mewujudkan persekitaran pembelajaran yang kondusif dan menyeronokkan, di mana setiap pelajar 
                dapat mengembangkan bakat dan potensi mereka sepenuhnya. Dengan kerjasama erat antara guru-guru yang dedikasi 
                dan ibu bapa yang prihatin, kita dapat membina asas yang kukuh untuk masa depan anak-anak kita.
              </p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="font-semibold text-emerald-800 text-lg italic"
              >
                "Marilah kita sama-sama mendidik generasi akan datang dengan ilmu dan iman."
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
