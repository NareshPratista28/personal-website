import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FolderOpen, FileText, Eye, Edit } from 'lucide-react'

export default async function AdminDashboard() {
	const [totalProjects, publishedProjects, totalPosts, publishedPosts] =
		await Promise.all([
			prisma.project.count(),
			prisma.project.count({ where: { status: 'PUBLISHED' } }),
			prisma.blogPost.count(),
			prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
		])

	const recentProjects = await prisma.project.findMany({
		take: 3,
		orderBy: { updatedAt: 'desc' },
	})

	const recentPosts = await prisma.blogPost.findMany({
		take: 3,
		orderBy: { updatedAt: 'desc' },
	})

	const stats = [
		{
			label: 'Total Projects',
			value: totalProjects,
			sub: `${publishedProjects} published`,
			icon: FolderOpen,
			href: '/admin/projects',
		},
		{
			label: 'Total Posts',
			value: totalPosts,
			sub: `${publishedPosts} published`,
			icon: FileText,
			href: '/admin/blog',
		},
	]

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-10">
				<p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
					Overview
				</p>
				<h1 className="text-4xl font-black text-white">Dashboard</h1>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
				{stats.map(stat => (
					<Link
						key={stat.label}
						href={stat.href}
						className="group bg-zinc-900 border border-white/10 hover:border-white/30 rounded-xl p-6 transition-all"
					>
						<div className="flex items-start justify-between mb-4">
							<stat.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
							<span className="text-xs text-zinc-500">View all →</span>
						</div>
						<p className="text-4xl font-black text-white mb-1">{stat.value}</p>
						<p className="text-sm font-semibold text-zinc-400">{stat.label}</p>
						<p className="text-xs text-zinc-600 mt-1">{stat.sub}</p>
					</Link>
				))}
			</div>

			{/* Recent Projects */}
			<div className="mb-10">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-lg font-bold text-white">Recent Projects</h2>
					<Link
						href="/admin/projects/new"
						className="text-xs font-bold tracking-widest uppercase text-white border border-white/20 rounded-lg px-4 py-2 hover:bg-white hover:text-black transition-all"
					>
						+ New
					</Link>
				</div>
				<div className="space-y-2">
					{recentProjects.map(project => (
						<div
							key={project.id}
							className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl px-5 py-4"
						>
							<div className="flex items-center gap-3 min-w-0">
								<span
									className={`text-xs font-bold px-2 py-0.5 rounded-full ${
										project.status === 'PUBLISHED'
											? 'bg-white/10 text-white'
											: 'bg-zinc-800 text-zinc-500'
									}`}
								>
									{project.status}
								</span>
								<span className="text-sm font-semibold text-white truncate">
									{project.title}
								</span>
								<span className="text-xs text-zinc-500 shrink-0">{project.category}</span>
							</div>
							<Link
								href={`/admin/projects/${project.id}/edit`}
								className="shrink-0 text-zinc-500 hover:text-white transition-colors"
							>
								<Edit className="w-4 h-4" />
							</Link>
						</div>
					))}
				</div>
			</div>

			{/* Recent Posts */}
			<div>
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-lg font-bold text-white">Recent Blog Posts</h2>
					<Link
						href="/admin/blog/new"
						className="text-xs font-bold tracking-widest uppercase text-white border border-white/20 rounded-lg px-4 py-2 hover:bg-white hover:text-black transition-all"
					>
						+ New
					</Link>
				</div>
				<div className="space-y-2">
					{recentPosts.map(post => (
						<div
							key={post.id}
							className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl px-5 py-4"
						>
							<div className="flex items-center gap-3 min-w-0">
								<span
									className={`text-xs font-bold px-2 py-0.5 rounded-full ${
										post.status === 'PUBLISHED'
											? 'bg-white/10 text-white'
											: 'bg-zinc-800 text-zinc-500'
									}`}
								>
									{post.status}
								</span>
								<span className="text-sm font-semibold text-white truncate">
									{post.title}
								</span>
							</div>
							<Link
								href={`/admin/blog/${post.id}/edit`}
								className="shrink-0 text-zinc-500 hover:text-white transition-colors"
							>
								<Edit className="w-4 h-4" />
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
