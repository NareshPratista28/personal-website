import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Calendar } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function BlogListingPage() {
	const posts = await prisma.blogPost.findMany({
		where: { status: 'PUBLISHED' },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<main className="min-h-screen bg-black text-white">
			{/* Navbar */}
			<nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 py-5">
				<div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
					<Link
						href="/#blogs"
						className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>
					<div className="relative h-6 w-24 opacity-50">
						<Image
							src="/logo_2024.png"
							alt="Logo"
							fill
							priority
							className="object-contain object-right"
						/>
					</div>
				</div>
			</nav>

			{/* Header */}
			<header className="pt-40 pb-16 border-b border-white/10">
				<div className="container mx-auto px-6 md:px-12 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Blog & Articles</h1>
					<p className="text-zinc-400 max-w-2xl mx-auto text-lg">
						Thoughts, ideas, and tutorials about software development and more.
					</p>
				</div>
			</header>

			{/* Posts Grid */}
			<section className="py-24 container mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
					{posts.map(post => {
						const date = post.publishedAt ?? post.createdAt
						const formatted = new Date(date).toLocaleDateString('en-US', {
							month: 'long',
							day: 'numeric',
							year: 'numeric',
						})

						return (
							<article
								key={post.id}
								className="group bg-zinc-900 border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-2xl"
							>
								<div className="w-full h-64 bg-zinc-800 overflow-hidden relative border-b border-white/10">
									{post.coverImageUrl ? (
										<Image
											src={post.coverImageUrl}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700">
											<ArrowUpRight size={48} className="text-zinc-500" />
										</div>
									)}
								</div>

								<div className="p-8 flex flex-col grow">
									<div className="flex items-center gap-2 text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">
										<Calendar className="w-3.5 h-3.5" />
										<time>{formatted}</time>
									</div>
									<h2 className="text-white text-2xl font-bold mb-4 line-clamp-2 group-hover:text-zinc-300 transition-colors">
										{post.title}
									</h2>
									<p className="text-zinc-400 text-sm mb-8 line-clamp-3 leading-relaxed grow">
										{post.excerpt}
									</p>

									<Link
										href={`/blog/${post.slug}`}
										className="inline-block text-white font-bold text-sm tracking-widest uppercase hover:text-zinc-300 transition-colors relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300"
									>
										Read Full Article
									</Link>
								</div>
							</article>
						)
					})}
				</div>

				{posts.length === 0 && (
					<div className="text-center py-20 text-zinc-500">
						<p>No articles published yet. Check back soon!</p>
					</div>
				)}
			</section>
		</main>
	)
}
