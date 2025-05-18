"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Utama", href: "#" },
  { name: "Tentang Kami", href: "#about" },
  { name: "Program", href: "#programs" },
  { name: "Galeri", href: "#gallery" },
  { name: "Hubungi Kami", href: "#contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 shadow-lg border-b border-white/10 backdrop-blur-md text-gray-900"
          : "bg-gradient-to-b from-black/50 to-transparent text-white"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                <span className="font-bold text-lg leading-tight text-black">
                  Sekolah Rendah Islam
                </span>
                <span className={`font-bold text-xl leading-tight ${isScrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>
                  Al-Khairiah
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isScrolled
                      ? 'text-emerald-800 hover:text-emerald-600'
                      : 'text-white hover:text-emerald-200'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className={`transition-colors ${
                      isScrolled
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-emerald-500/80 hover:bg-emerald-400/80 backdrop-blur-md'
                    }`}
                  >
                    Aplikasi
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/panel" className="cursor-pointer">
                      Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#guru" className="cursor-pointer">
                      Guru
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#pelajar" className="cursor-pointer">
                      Pelajar
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`md:hidden ${
                  isScrolled ? 'text-emerald-800' : 'text-white'
                }`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-emerald-800 hover:text-emerald-600 font-medium text-lg transition-colors block py-2"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-4">
                  <p className="font-medium text-emerald-800 mb-2">Aplikasi:</p>
                  <div className="flex flex-col gap-2 pl-2">
                    <Link href="#admin" className="text-emerald-700 hover:text-emerald-600 transition-colors">
                      Admin
                    </Link>
                    <Link href="#guru" className="text-emerald-700 hover:text-emerald-600 transition-colors">
                      Guru
                    </Link>
                    <Link href="#pelajar" className="text-emerald-700 hover:text-emerald-600 transition-colors">
                      Pelajar
                    </Link>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
