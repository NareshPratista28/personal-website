'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from './ConfirmDialog'

type Post = {
	id: string
	title: string
	excerpt: string
	status: string
	publishedAt: Date | null
}

export default function BlogListClient({ initialPosts }: { initialPosts: Post[] }) {
	const [posts, setPosts] = useState(initialPosts)
	const [search, setSearch] = useState('')
	
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const router = useRouter()

	const filteredPosts = posts.filter(p => 
		p.title.toLowerCase().includes(search.toLowerCase()) || 
		p.excerpt.toLowerCase().includes(search.toLowerCase())
	)

	async function handleDelete() {
		if (!deletingId) return
		setIsDeleting(true)
		await fetch(`/api/blog/${deletingId}`, { method: 'DELETE' })
		setPosts(p => p.filter(x => x.id !== deletingId))
		setIsDeleting(false)
		setDeletingId(null)
		router.refresh()
	}

	return (
		<div className="space-y-6">
			{/* Search Bar */}
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
				<input
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search posts by title or excerpt..."
					className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 transition-colors outline-none"
				/>
			</div>

			<ConfirmDialog
				isOpen={!!deletingId}
				onClose={() => setDeletingId(null)}
				onConfirm={handleDelete}
				isLoading={isDeleting}
				title="Delete Blog Post"
				description="Are you sure you want to delete this post? This action cannot be undone."
			/>

			<div className="space-y-3">
				{filteredPosts.length === 0 ? (
					<div className="text-center py-24 text-zinc-600 border border-dashed border-white/10 rounded-xl">
						<p className="text-sm">No posts found.</p>
					</div>
				) : (
					filteredPosts.map(post => (
						<div
							key={post.id}
							className="group bg-zinc-900 border border-white/10 hover:border-white/20 rounded-xl px-6 py-5 flex items-start justify-between gap-4 transition-all hover:bg-white/[0.02]"
						>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2 mb-2">
									<span
										className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-full ${
											post.status === 'PUBLISHED'
												? 'bg-green-500/10 text-green-400'
												: 'bg-zinc-800 text-zinc-500'
										}`}
									>
										{post.status}
									</span>
									{post.publishedAt && (
										<span className="text-xs text-zinc-600">
											{new Date(post.publishedAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</span>
									)}
								</div>
								<h3 className="text-base font-bold text-white truncate">{post.title}</h3>
								<p className="text-xs text-zinc-500 mt-1 line-clamp-1">{post.excerpt}</p>
							</div>
							
							<div className="flex items-center gap-2 pt-1 shrink-0">
								<Link
									href={`/admin/blog/${post.id}/edit`}
									className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
								>
									<Edit className="w-4 h-4" />
								</Link>
								<button
									onClick={() => setDeletingId(post.id)}
									className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}
