"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BookOpen, GraduationCap, Heart, Lightbulb, Music, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgramsSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const programs = [
    {
      title: "Kurikulum Akademik",
      description: "Kurikulum Standard Sekolah Rendah (KSSR) yang ditetapkan oleh Kementerian Pendidikan Malaysia dengan pendekatan pembelajaran bersepadu.",
      icon: BookOpen,
    },
    {
      title: "Kurikulum Diniah & KAFA",
      description: "Pengajian berdasarkan kurikulum yang ditetapkan oleh JAKIM dan Jabatan Hal Ehwal Islam Negeri Kedah untuk membentuk asas keagamaan yang komprehensif.",
      icon: GraduationCap,
    },
    {
      title: "Pembangunan Sahsiah",
      description: "Program pembentukan akhlak dan jati diri berlandaskan nilai-nilai Islam untuk melahirkan pelajar yang berakhlak mulia dan berkeyakinan tinggi.",
      icon: Heart,
    },
    {
      title: "Aktiviti Ko-Kurikulum",
      description: "Pelbagai aktiviti termasuk kesenian Islam, memanah dan sukan lain yang membangunkan kemahiran kepimpinan dan kerja berpasukan.",
      icon: Users,
    },
    {
      title: "Akademi Pembangunan Murid",
      description: "Program APM yang komprehensif merangkumi silibus teori dan praktikal untuk memastikan pembangunan pelajar yang holistik dan seimbang.",
      icon: Lightbulb,
    },
    {
      title: "Program Agropreneur",
      description: "Pendedahan kepada teknik agrikultur moden dan kemahiran keusahawanan berkaitan pertanian untuk menyemai minat dan bakat dalam bidang agrikultur.",
      icon: Music,
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="programs" className="py-20 bg-emerald-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Program Kami</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menawarkan pelbagai program pendidikan yang komprehensif untuk memastikan perkembangan pelajar yang
            seimbang dari segi akademik, spiritual dan sahsiah.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {programs.map((program, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <program.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl text-emerald-800">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{program.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
