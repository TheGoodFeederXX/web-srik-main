"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Maklumat Guru",
    href: "/dashboard/profile",
  },
  {
    title: "Permohonan Cuti",
    href: "/dashboard/leave",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="mr-4 flex">
      <div className="mr-4 hidden md:flex">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">SRIK Al-Khairiah</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="w-8 h-8">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link href="/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">SRIK Al-Khairiah</span>
          </Link>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col space-y-3 p-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex py-2 text-foreground/70 hover:text-foreground",
                    pathname === item.href && "text-foreground font-semibold",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
