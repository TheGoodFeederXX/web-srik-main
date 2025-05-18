"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, GraduationCap, Calendar, CreditCard, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Maklumat Pelajar",
    href: "/dashboard/student-info",
    icon: User,
  },
  {
    title: "Maklumat Akademik",
    href: "/dashboard/academic-info",
    icon: GraduationCap,
  },
  {
    title: "Permohonan Cuti",
    href: "/dashboard/leave-application",
    icon: Calendar,
  },
  {
    title: "Pembayaran Yuran",
    href: "/dashboard/fee-payment",
    icon: CreditCard,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "bg-gray-50 w-64 border-r p-4 flex-shrink-0 fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="space-y-1 pt-16 md:pt-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                pathname === item.href ? "bg-gray-100 text-green-700" : "text-gray-700",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
