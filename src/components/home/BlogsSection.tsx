'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cardMotion, sectionMotion } from '@/components/home/motion'
import Image from 'next/image'

type Post = {
	id: string
	title: string
	slug: string
	excerpt: string
	coverImageUrl: string | null
	publishedAt: Date | null
	createdAt: Date
	status: string
}

export default function BlogsSection({ posts }: { posts: Post[] }) {
	return (
		<motion.section
			id="blogs"
			className="relative w-full py-24 lg:py-32 bg-zinc-950 border-t border-white/5"
			{...sectionMotion}
		>
			<div className="absolute bottom-0 right-1/4 w-full max-w-2xl h-64 bg-zinc-800/10 blur-[120px] rounded-full pointer-events-none" />

			<div className="container mx-auto px-6 md:px-12 text-center relative z-10">
				<div className="flex flex-col items-center mb-16">
					<div className="flex items-center gap-4 mb-4">
						<span className="w-8 h-[1px] bg-zinc-500"></span>
						<span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
							Latest Thoughts
						</span>
						<span className="w-8 h-[1px] bg-zinc-500"></span>
					</div>
					<h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Blog & Articles</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
					{posts.map(post => {
						const date = post.publishedAt ?? post.createdAt
						const formatted = new Date(date).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						})

						return (
							<motion.article
								key={post.id}
								className="group bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col hover:-translate-y-2 hover:bg-white/[0.04] shadow-lg hover:shadow-2xl hover:shadow-white/5 relative"
								{...cardMotion}
							>
								<div className="w-full h-64 bg-zinc-900/50 overflow-hidden relative border-b border-white/5">
									{post.coverImageUrl ? (
										<Image
											src={post.coverImageUrl}
											alt={post.title}
											fill
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center opacity-20 transition-transform duration-700 group-hover:scale-105">
											<ArrowUpRight size={48} className="text-zinc-500" />
										</div>
									)}
									<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
								</div>

								<div className="p-8 flex flex-col grow relative z-10 -mt-8">
									<div className="flex items-center justify-between mb-4">
										<span className="px-3 py-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold tracking-widest uppercase rounded-full">
											Article
										</span>
										<span className="text-zinc-500 text-xs font-medium tracking-wide">
											{formatted}
										</span>
									</div>
									<Link href={`/blog/${post.slug}`} className="block">
										<h3 className="text-white text-2xl font-heading font-bold mb-3 line-clamp-2 group-hover:text-zinc-200 transition-colors">
											{post.title}
										</h3>
									</Link>
									<p className="text-zinc-400 text-sm mb-8 line-clamp-3 leading-relaxed grow font-light">
										{post.excerpt}
									</p>

									<Link
										href={`/blog/${post.slug}`}
										className="inline-flex items-center gap-2 text-zinc-300 font-medium text-xs tracking-widest uppercase group-hover:text-white transition-colors relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300"
									>
										Read More
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
									</Link>
								</div>
							</motion.article>
						)
					})}
				</div>

				{posts.length === 0 && (
					<motion.p 
						initial={{ opacity: 0 }} 
						animate={{ opacity: 1 }} 
						className="text-center text-zinc-600 py-24 font-light text-lg"
					>
						No posts published yet.
					</motion.p>
				)}

				<div className="mt-20">
					<Link href="/blog">
						<Button
							size="lg"
							className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl px-12 py-7 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1"
						>
							Explore More
						</Button>
					</Link>
				</div>
			</div>
		</motion.section>
	)
}
