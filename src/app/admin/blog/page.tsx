import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import BlogListClient from '@/components/admin/BlogListClient'

export default async function AdminBlogPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: string }>
}) {
	const { status } = await searchParams
	const filter = status === 'published' ? 'PUBLISHED' : status === 'drafts' ? 'DRAFT' : undefined

	const posts = await prisma.blogPost.findMany({
		where: filter ? { status: filter } : undefined,
		orderBy: { createdAt: 'desc' },
	})

	const [publishedCount, draftCount, totalCount] = await Promise.all([
		prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
		prisma.blogPost.count({ where: { status: 'DRAFT' } }),
		prisma.blogPost.count(),
	])

	const tabs = [
		{ label: 'All', value: undefined, count: totalCount },
		{ label: 'Published', value: 'published', count: publishedCount },
		{ label: 'Drafts', value: 'drafts', count: draftCount },
	]

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex items-end justify-between mb-8">
				<div>
					<p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
						Content
					</p>
					<h1 className="text-4xl font-black text-white">Blog Posts</h1>
				</div>
				<Link
					href="/admin/blog/new"
					className="flex items-center gap-2 bg-white text-black font-bold text-xs tracking-widest uppercase px-5 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
				>
					<Plus className="w-3.5 h-3.5" />
					New Post
				</Link>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-1 mb-6">
				{tabs.map(tab => {
					const isActive = tab.value === status || (!tab.value && !status)
					const href = tab.value ? `/admin/blog?status=${tab.value}` : '/admin/blog'
					return (
						<Link
							key={tab.label}
							href={href}
							className={`text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-lg transition-all ${
								isActive
									? 'bg-white text-black'
									: 'text-zinc-500 hover:text-white hover:bg-white/5'
							}`}
						>
							{tab.label}
							<span className={`ml-1.5 ${isActive ? 'text-zinc-600' : 'text-zinc-700'}`}>
								{tab.count}
							</span>
						</Link>
					)
				})}
			</div>

			{/* Posts */}
			<BlogListClient initialPosts={posts} />
		</div>
	)
}
