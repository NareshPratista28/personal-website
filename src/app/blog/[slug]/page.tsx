import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	const post = await prisma.blogPost.findUnique({
		where: { slug },
	})

	if (!post || post.status !== 'PUBLISHED') {
		notFound()
	}

	const formattedDate = new Date(post.publishedAt ?? post.createdAt).toLocaleDateString(
		'en-US',
		{ month: 'long', day: 'numeric', year: 'numeric' },
	)

	return (
		<main className="min-h-screen bg-black text-white selection:bg-white/20">
			{/* Simple top nav just for back button */}
			<nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 py-5">
				<div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
					<Link
						href="/#blogs"
						className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>
					{/* Logo to keep brand consistency on blog pages */}
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

			<article className="pt-40 pb-32">
				{/* Header Section */}
				<header className="container mx-auto px-6 md:px-12 max-w-4xl mb-16 text-center">
					<div className="flex items-center justify-center gap-6 text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>{formattedDate}</span>
						</div>
						<div className="flex items-center gap-2">
							<User className="w-4 h-4" />
							<span>Admin</span>
						</div>
					</div>

					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
						{post.title}
					</h1>
					
					{post.excerpt && (
						<p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
							{post.excerpt}
						</p>
					)}
				</header>

				{/* Cover Image */}
				{post.coverImageUrl && (
					<div className="w-full max-w-6xl mx-auto px-6 md:px-12 mb-20">
						<div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
							<Image
								src={post.coverImageUrl}
								alt={post.title}
								fill
								priority
								quality={90}
								className="object-cover"
							/>
						</div>
					</div>
				)}

				{/* Content */}
				<div className="container mx-auto px-6 md:px-12 max-w-3xl">
					<div
						className="prose prose-invert prose-lg md:prose-xl max-w-none 
						prose-headings:font-bold prose-headings:tracking-tight
						prose-a:text-white prose-a:underline-offset-4 hover:prose-a:text-zinc-300 
						prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-xl
						prose-hr:border-white/10
						prose-blockquote:border-l-white/20 prose-blockquote:text-zinc-400 prose-blockquote:font-normal prose-blockquote:not-italic
						prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
						prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10
						leading-relaxed"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</div>
			</article>
		</main>
	)
}
