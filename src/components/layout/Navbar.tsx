'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
	{ name: 'HOME', href: '#home', sectionId: 'home' },
	{ name: 'ABOUT', href: '#about', sectionId: 'about' },
	{ name: 'PROJECTS', href: '#projects', sectionId: 'projects' },
	{ name: 'BLOG', href: '#blogs', sectionId: 'blogs' },
	{ name: 'CONTACT', href: '#contact', sectionId: 'contact' },
]

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [activeSection, setActiveSection] = useState('home')
	const pathname = usePathname()

	if (pathname?.startsWith('/admin')) return null

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 40)
		}

		handleScroll()
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		const sectionIds = NAV_LINKS.map(link => link.sectionId)
		const sections = sectionIds
			.map(id => document.getElementById(id))
			.filter((element): element is HTMLElement => Boolean(element))

		if (!sections.length) {
			return
		}

		const observer = new IntersectionObserver(
			entries => {
				const visibleEntries = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)

				if (visibleEntries.length > 0) {
					setActiveSection(visibleEntries[0].target.id)
				}
			},
			{
				root: null,
				rootMargin: '-30% 0px -55% 0px',
				threshold: [0.1, 0.25, 0.5],
			},
		)

		sections.forEach(section => observer.observe(section))

		return () => {
			sections.forEach(section => observer.unobserve(section))
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobileMenuOpen])

	const handleNavClick = (href: string, sectionId: string) => {
		setActiveSection(sectionId)
		setIsMobileMenuOpen(false)

		const target = document.getElementById(sectionId)
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' })
			window.history.replaceState(null, '', href)
		}
	}

	return (
		<>
			<header
				className={`fixed top-0 w-full z-50 transition-all duration-300 ${
					isScrolled
						? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3'
						: 'bg-transparent py-5'
				}`}
			>
				<div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
					<Link
						href="#home"
						onClick={event => {
							event.preventDefault()
							handleNavClick('#home', 'home')
						}}
						className="flex items-center gap-2"
					>
						<div className="relative h-10 w-36">
							<Image
								src="/logo_2024.png"
								alt="Logo"
								fill
								priority
								className="object-contain object-left"
							/>
						</div>
					</Link>

					<nav className="hidden md:flex items-center space-x-8">
						{NAV_LINKS.map(link => (
							<button
								key={link.name}
								type="button"
								onClick={() => handleNavClick(link.href, link.sectionId)}
								className={`text-xs font-semibold tracking-wider transition-colors duration-200 ${
									activeSection === link.sectionId
										? 'text-white'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								{link.name}
							</button>
						))}
					</nav>

					<div className="hidden md:flex items-center">
						<div className="relative group">
							{/* Ripple effects */}
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className="absolute inset-0 border border-white/50 z-0"
									initial={{ scale: 1, opacity: 0.5 }}
									animate={{ 
										scale: [1, 2], 
										opacity: [0.5, 0] 
									}}
									transition={{ 
										duration: 2, 
										repeat: Infinity, 
										delay: i * 0.6,
										ease: "easeOut" 
									}}
								/>
							))}
							
							<Button
								type="button"
								variant="secondary"
								onClick={() => handleNavClick('#contact', 'contact')}
								className="relative z-10 bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 px-6 rounded-none tracking-wide text-xs font-bold"
							>
								HIRE ME
							</Button>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(previousState => !previousState)}
						className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-white/20 text-white"
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</header>

			<div
				className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
					isMobileMenuOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
			>
				<div className="h-full flex flex-col justify-center items-center gap-7">
					{NAV_LINKS.map(link => (
						<button
							key={link.name}
							type="button"
							onClick={() => handleNavClick(link.href, link.sectionId)}
							className={`text-sm tracking-[0.2em] uppercase transition-colors ${
								activeSection === link.sectionId
									? 'text-white'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							{link.name}
						</button>
					))}

					<Button
						variant="outline"
						onClick={() => handleNavClick('#contact', 'contact')}
						className="bg-transparent text-white border-gray-600 hover:bg-white hover:text-black hover:border-white transition-all duration-300 px-6 rounded-none tracking-wide text-xs"
					>
						CONTACT ME
					</Button>
				</div>
			</div>
		</>
	)
}
