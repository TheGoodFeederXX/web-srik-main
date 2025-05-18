"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
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
	const [scrollAmount, setScrollAmount] = React.useState(0)
	
	React.useEffect(() => {
		const handleScroll = () => {
			setScrollAmount(Math.min(100, window.scrollY))
			
			// Set scrolled state
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
		<header 
			className={`sticky top-4 md:top-6 z-50 w-[95%] md:w-[90%] lg:w-[85%] mx-auto transition-all duration-500 ease-out rounded-2xl ${
				isScrolled
					? "bg-background/30 shadow-lg border border-white/20 backdrop-blur-xl text-foreground dark:bg-gray-900/30 dark:border-gray-800/20"
					: "bg-gradient-to-b from-theme-dark/30 to-theme-dark/10 dark:from-gray-900/30 dark:to-gray-900/10 backdrop-blur-lg text-white shadow-md"
			}`}
			style={{
				boxShadow: isScrolled 
					? "0 8px 32px -12px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)" 
					: "0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				opacity: 0.7 + (scrollAmount / 100) * 0.3,
				backdropFilter: `blur(${3 + (scrollAmount / 100) * 7}px)`,
				transform: `translateY(${3 - (scrollAmount / 100) * 3}px)`
			}}
		>
			<div className="container mx-auto px-4">
				<div className="flex h-20 items-center justify-between">
					<div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/logo.png"
								alt="Sekolah Rendah Islam Al-Khairiah Logo"
								width={60}
								height={60}
								className="h-14 w-auto drop-shadow-md"
							/>
							<div className="flex flex-col">
								<span className={`font-bold text-lg leading-tight ${isScrolled ? 'text-black dark:text-white' : 'text-white text-shadow-sm'}`}>
									Sekolah Rendah Islam
								</span>
								<span className={`font-bold text-xl leading-tight ${isScrolled ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-300 text-shadow-md'}`}>
									Al-Khairiah
								</span>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{navItems.map((item) => (
							<div
								key={item.name}
								className="transition-transform duration-300 hover:-translate-y-0.5"
							>
								<Link
									href={item.href}
									className={`font-medium transition-colors relative px-2 py-1.5 rounded-md ${
										isScrolled
											? 'text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20'
											: 'text-white hover:text-emerald-200 text-shadow-sm hover:bg-white/10'
									}`}
								>
									<span className="relative z-10">{item.name}</span>
									{!isScrolled && (
										<span className="absolute inset-0 bg-black/10 blur-md rounded-md -z-10"></span>
									)}
								</Link>
							</div>
						))}
						<div className="transition-transform duration-300 hover:scale-105">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button 
										className={`group relative px-4 py-2 font-medium text-sm rounded-full transition-all duration-300 overflow-hidden ${
											isScrolled
												? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-200/40 border-none translate-y-0 hover:-translate-y-0.5'
												: 'bg-gradient-to-r from-purple-600/90 to-violet-500/90 text-white hover:from-purple-600 hover:to-violet-500 backdrop-blur-lg border border-purple-300/20'
										}`}
									>
										<span className="relative z-10 flex items-center gap-1.5">
											<span className="w-1.5 h-1.5 rounded-full bg-white group-hover:animate-pulse"></span>
											<span>Aplikasi</span>
										</span>
										<span className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/30 to-violet-600/0 rounded-full -z-10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent 
									align="end"
									className="min-w-[180px] overflow-hidden bg-white/80 backdrop-blur-xl border border-emerald-100/50 shadow-lg shadow-emerald-500/10 rounded-xl p-1.5"
								>
									<DropdownMenuItem asChild className="rounded-lg flex items-center gap-2.5 hover:bg-indigo-50/80 focus:bg-indigo-50/90 py-2.5 my-0.5 transition-colors duration-150">
										<Link href="/admin/panel" className="cursor-pointer w-full">
											<span className="w-1.5 h-1.5 rounded-full bg-indigo-500 transition-transform duration-300 group-hover:scale-125"></span>
											<span className="ml-1.5 text-indigo-900">Admin</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="rounded-lg flex items-center gap-2.5 hover:bg-emerald-50/80 focus:bg-emerald-50/90 py-2.5 my-0.5 transition-colors duration-150">
										<Link href="#guru" className="cursor-pointer w-full">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-125"></span>
											<span className="ml-1.5 text-emerald-900">Guru</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="rounded-lg flex items-center gap-2.5 hover:bg-amber-50/80 focus:bg-amber-50/90 py-2.5 my-0.5 transition-colors duration-150">
										<Link href="#pelajar" className="cursor-pointer w-full">
											<span className="w-1.5 h-1.5 rounded-full bg-amber-500 transition-transform duration-300 group-hover:scale-125"></span>
											<span className="ml-1.5 text-amber-900">Pelajar</span>
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</nav>

					{/* Mobile Navigation */}
					<Sheet>
						<SheetTrigger asChild>
							<Button 
								variant="ghost" 
								size="icon" 
								className={`md:hidden ${
									isScrolled ? 'text-emerald-800 dark:text-emerald-300' : 'text-white'
								} hover:bg-white/10 backdrop-blur-lg rounded-full`}
							>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent 
							side="right" 
							className="bg-white/90 backdrop-blur-xl dark:bg-gray-900/90 border-l border-emerald-100/30 dark:border-gray-700/30"
						>
							<div className="mt-2 p-2">
								<Link href="/" className="flex items-center gap-2 mb-6">
									<Image
										src="/logo.png"
										alt="Sekolah Rendah Islam Al-Khairiah Logo"
										width={40}
										height={40}
										className="h-10 w-auto drop-shadow-md"
									/>
									<div className="flex flex-col">
										<span className="font-bold text-sm leading-tight text-emerald-900 dark:text-white">
											Sekolah Rendah Islam
										</span>
										<span className="font-bold text-base leading-tight text-emerald-600 dark:text-emerald-400">
											Al-Khairiah
										</span>
									</div>
								</Link>
							</div>
							<nav className="flex flex-col gap-2 mt-4">
								{navItems.map((item, index) => (
									<div
										key={item.name}
										className="transition-all duration-200 hover:translate-x-1"
									>
										<Link
											href={item.href}
											className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-lg transition-colors block py-2 px-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
										>
											{item.name}
										</Link>
									</div>
								))}
								<div className="mt-8 border-t border-emerald-100 dark:border-emerald-800/30 pt-6">
									<p className="font-medium text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2 px-3">
										<span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></span>
										<span>Aplikasi</span>
									</p>
									<div className="flex flex-col gap-3 pl-3 mt-2 border-l-2 border-violet-200 dark:border-violet-800/40">
										<Link 
											href="/admin/panel" 
											className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all duration-200"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></span>
											<span className="text-indigo-900 dark:text-indigo-300 group-hover:translate-x-0.5 transition-transform">Admin</span>
										</Link>
										<Link 
											href="#guru" 
											className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all duration-200"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></span>
											<span className="text-emerald-900 dark:text-emerald-300 group-hover:translate-x-0.5 transition-transform">Guru</span>
										</Link>
										<Link 
											href="#pelajar" 
											className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all duration-200"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
											<span className="text-amber-900 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform">Pelajar</span>
										</Link>
									</div>
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
