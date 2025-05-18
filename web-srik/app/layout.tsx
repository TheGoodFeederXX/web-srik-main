import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/session-provider'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ClientPathCheck } from '@/components/client-path-check'
import './globals.css'

export const metadata: Metadata = {
  title: 'Laman Rasmi Sekolah Rendah Islam Al-Khairiah',
  description: 'Laman Rasmi Sekolah Rendah Islam Al-Khairiah - Pendidikan berkualiti berlandaskan nilai-nilai Islam',
  generator: 'Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 2,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: '#10b981',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    url: 'https://al-khairiah.edu.my',
    title: 'Sekolah Rendah Islam Al-Khairiah',
    description: 'Pendidikan berkualiti berlandaskan nilai-nilai Islam',
    siteName: 'Sekolah Rendah Islam Al-Khairiah',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientPathCheck>
              {(isDashboard) => (
                <div className="min-h-screen bg-background dark:bg-gray-950">
                  {!isDashboard && <Navbar />}
                  <main className="overflow-hidden">
                    {children}
                  </main>
                  {!isDashboard && <Footer />}
                </div>
              )}
            </ClientPathCheck>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
