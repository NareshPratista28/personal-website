'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Linkedin02Icon, GithubIcon, Mail01Icon } from '@hugeicons/core-free-icons'
import Marquee from 'react-fast-marquee'
import StarryBackground from '@/components/ui/StarryBackground'

type HeroSectionProps = {
	name: string
	tagline: string
	bio: string
	techStack: string[]
	githubUrl: string
	linkedinUrl: string
	email: string
}

export default function HeroSection({
	name,
	tagline,
	bio,
	techStack,
	githubUrl,
	linkedinUrl,
	email,
}: HeroSectionProps) {
	return (
		<div
			id="home"
			className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black scroll-mt-28"
		>
			<StarryBackground />

			<div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
				<motion.h1 
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-[12vw] font-heading font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white/10 to-transparent select-none pointer-events-none opacity-50"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.5, ease: 'easeOut' }}
				>
					{name.split(' ')[0]}
				</motion.h1>

				<motion.div 
					className="relative z-20 mt-12 md:mt-24 flex flex-col items-center"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
				>
					<h2 className="text-xl md:text-3xl font-heading font-medium tracking-[0.3em] text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-500 my-6 uppercase">
						{tagline}
					</h2>

					<p className="text-sm md:text-base text-zinc-400 font-light tracking-wide max-w-2xl mx-auto italic mb-10 leading-relaxed">
						{bio}
					</p>

					<div className="flex items-center gap-8">
						<Link
							href={linkedinUrl}
							className="text-zinc-500 hover:text-white transition-all hover:scale-110 hover:shadow-white/20 drop-shadow-md"
						>
							<HugeiconsIcon icon={Linkedin02Icon} size={28} />
						</Link>
						<Link
							href={githubUrl}
							className="text-zinc-500 hover:text-white transition-all hover:scale-110 hover:shadow-white/20 drop-shadow-md"
						>
							<HugeiconsIcon icon={GithubIcon} size={28} />
						</Link>
						<Link
							href={`mailto:${email}`}
							className="text-zinc-500 hover:text-white transition-all hover:scale-110 hover:shadow-white/20 drop-shadow-md"
						>
							<HugeiconsIcon icon={Mail01Icon} size={28} />
						</Link>
					</div>
				</motion.div>
			</div>

			{techStack.length > 0 && (
				<div className="absolute bottom-0 w-full border-t border-white/10 bg-black/50 backdrop-blur-md py-5 z-30">
					<div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-black to-transparent z-40"></div>
					<div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-black to-transparent z-40"></div>

					<Marquee gradient={false} speed={40}>
						{techStack.map((tech, index) => (
							<span
								key={index}
								className="mx-8 md:mx-12 text-xs md:text-sm text-gray-500 font-semibold tracking-widest uppercase hover:text-white transition-colors cursor-default"
							>
								{tech}
							</span>
						))}
					</Marquee>
				</div>
			)}
		</div>
	)
}
