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
			className="relative w-full py-24 lg:py-32 bg-black border-t border-white/10"
			{...sectionMotion}
		>
			<div className="container mx-auto px-6 md:px-12 text-center">
				<div className="flex flex-col items-center mb-16">
					<div className="flex items-center gap-4 mb-4">
						<span className="w-8 h-0.5 bg-white"></span>
						<span className="text-sm font-semibold tracking-widest uppercase text-gray-400">
							Latest Blogs
						</span>
						<span className="w-8 h-0.5 bg-white"></span>
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-white">Blog &amp; Articles</h2>
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
								className="group bg-zinc-900 border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-white/5"
								{...cardMotion}
							>
								<div className="w-full h-56 bg-zinc-800 overflow-hidden relative border-b border-white/10">
									{post.coverImageUrl ? (
										<Image
											src={post.coverImageUrl}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-500">
											<ArrowUpRight size={40} className="text-gray-500" />
										</div>
									)}
								</div>

								<div className="p-6 md:p-8 flex flex-col grow">
									<div className="flex items-center justify-between text-gray-400 text-xs tracking-wider uppercase mb-4">
										<span>Article</span>
										<span>{formatted}</span>
									</div>
									<h3 className="text-white text-xl font-bold mb-4 line-clamp-2 hover:text-gray-300 transition-colors cursor-pointer">
										{post.title}
									</h3>
									<p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed grow">
										{post.excerpt}
									</p>

									<Link
										href={`/blog/${post.slug}`}
										className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-zinc-300 transition-colors relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300"
									>
										Read More
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</Link>
								</div>
							</motion.article>
						)
					})}
				</div>

				{posts.length === 0 && (
					<p className="text-zinc-600 py-8">No posts published yet.</p>
				)}

				<div className="mt-16">
					<Link href="/blog">
						<Button
							size="lg"
							className="bg-white text-black hover:bg-gray-200 rounded-none px-10 py-6 text-sm font-bold tracking-widest uppercase"
						>
							Explore More
						</Button>
					</Link>
				</div>
			</div>
		</motion.section>
	)
}
