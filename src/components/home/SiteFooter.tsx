'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function SiteFooter() {
	return (
		<motion.footer
			className="w-full border-t border-white/10 bg-black"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6 }}
		>
			<div className="container mx-auto px-6 md:px-12 py-12 md:py-14">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start">
					<div>
						<h3 className="text-2xl font-bold text-white tracking-tight">
							Naresh Pratista
						</h3>
						<p className="text-gray-500 mt-3 max-w-sm">
							Do what you love, love what you do.
						</p>
					</div>

					<div className="md:justify-self-center">
						<p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
							Quick Links
						</p>
						<div className="flex flex-col gap-2 text-gray-500">
							<Link href="#" className="hover:text-white transition-colors">
								About
							</Link>
							<Link href="#" className="hover:text-white transition-colors">
								Projects
							</Link>
							<Link href="#" className="hover:text-white transition-colors">
								Blogs
							</Link>
							<Link href="#" className="hover:text-white transition-colors">
								Contact
							</Link>
						</div>
					</div>

					<div className="md:justify-self-end">
						<p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
							Newsletter
						</p>
						<div className="flex items-center border border-white/20 bg-zinc-950">
							<input
								type="email"
								placeholder="Your email"
								className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none"
							/>
							<button className="px-4 py-3 border-l border-white/20 text-white hover:bg-white/10 transition-colors">
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<p className="text-sm text-gray-500">
						© {new Date().getFullYear()} Naresh Pratista. All rights reserved.
					</p>
				</div>
			</div>
		</motion.footer>
	)
}
