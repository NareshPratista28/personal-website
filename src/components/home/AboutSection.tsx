'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sectionMotion } from '@/components/home/motion'
import Link from 'next/link'

type AboutSectionProps = {
	name: string
	role: string
	bio: string
	image: string
	cvUrl: string
	hireMeEmail: string
}

export default function AboutSection({ name, role, bio, image, cvUrl, hireMeEmail }: AboutSectionProps) {
	return (
		<motion.section
			id="about"
			className="relative w-full py-24 lg:py-32 bg-black border-t border-white/10 overflow-hidden"
			{...sectionMotion}
		>
			<div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
				<div className="flex flex-col items-start space-y-6 z-10">
					<div className="flex items-center gap-4">
						<span className="w-12 h-0.5 bg-white"></span>
						<span className="text-sm font-semibold tracking-widest uppercase text-gray-400">
							Hello There
						</span>
					</div>

					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
						I&apos;m {name} <br />
						<span className="text-gray-500">{role}</span>
					</h2>

					<p className="text-base md:text-lg text-gray-400 max-w-lg leading-relaxed">
						{bio}
					</p>

					<div className="pt-4 flex flex-wrap gap-4">
						<Link href={`mailto:${hireMeEmail}`}>
							<Button
								size="lg"
								className="bg-white text-black hover:bg-gray-200 rounded-none px-8 py-6 text-sm font-bold tracking-widest uppercase flex items-center gap-3 group transition-all"
							>
								Hire Me
								<ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
							</Button>
						</Link>

						{cvUrl && cvUrl !== '#' && (
							<Link href={cvUrl} target="_blank" rel="noopener noreferrer">
								<Button
									size="lg"
									variant="outline"
									className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white rounded-none px-8 py-6 text-sm font-bold tracking-widest uppercase flex items-center gap-3 group transition-all"
								>
									Download CV
									<Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
								</Button>
							</Link>
						)}
					</div>
				</div>

				<div className="relative w-full aspect-square md:aspect-auto md:h-125 lg:h-150 flex items-center justify-center">
					<div className="absolute w-[85%] sm:w-[70%] lg:w-[80%] aspect-square border border-white/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
					<div className="absolute w-[65%] sm:w-[50%] lg:w-[60%] aspect-square border border-dashed border-white/30 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

					<div className="relative w-[50%] aspect-square sm:aspect-auto sm:h-[60%] bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.01]">
						<Image
							src={image}
							alt={`${name} profile photo`}
							fill
							sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 28vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-black/35"></div>
					</div>

					<div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white/50 rounded-full blur-[1px]"></div>
					<div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
				</div>
			</div>
		</motion.section>
	)
}
