"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ClientPathCheckProps {
  children: (shouldHideNavbar: boolean) => React.ReactNode
}

export function ClientPathCheck({ children }: ClientPathCheckProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Default to showing navbar until client-side code runs
  if (!mounted) return children(false)
  
  // Paths where navbar should be hidden
  const shouldHideNavbar = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/admin') || 
    pathname === '/login'
    
  return children(shouldHideNavbar)
}