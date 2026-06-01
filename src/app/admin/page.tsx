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
		<div className="p-8 md:p-12 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-12">
				<p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">
					Overview
				</p>
				<h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Dashboard</h1>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
				{stats.map(stat => (
					<Link
						key={stat.label}
						href={stat.href}
						className="group relative bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-white/20 rounded-2xl p-8 transition-all duration-500 flex flex-col hover:-translate-y-1 hover:bg-white/[0.04] shadow-lg hover:shadow-2xl hover:shadow-white/5 overflow-hidden"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
						
						<div className="flex items-start justify-between mb-6 relative z-10">
							<div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
								<stat.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
							</div>
							<span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 group-hover:text-white transition-colors flex items-center gap-1">
								View <Eye className="w-3 h-3" />
							</span>
						</div>
						<p className="text-5xl font-heading font-black text-white mb-2 relative z-10 tracking-tight">{stat.value}</p>
						<p className="text-sm font-semibold text-zinc-400 relative z-10">{stat.label}</p>
						<p className="text-xs text-zinc-600 mt-2 font-medium relative z-10">{stat.sub}</p>
					</Link>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Recent Projects */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-heading font-bold text-white tracking-tight">Recent Projects</h2>
						<Link
							href="/admin/projects/new"
							className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-950 bg-white border border-transparent rounded-lg px-4 py-2.5 hover:bg-zinc-200 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
						>
							+ New
						</Link>
					</div>
					<div className="space-y-3">
						{recentProjects.map(project => (
							<div
								key={project.id}
								className="group flex items-center justify-between bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-xl px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
							>
								<div className="flex items-center gap-4 min-w-0">
									<span
										className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
											project.status === 'PUBLISHED'
												? 'bg-green-500/10 text-green-400 border border-green-500/20'
												: 'bg-zinc-800 text-zinc-400 border border-zinc-700'
										}`}
									>
										{project.status}
									</span>
									<span className="text-sm font-semibold text-white truncate group-hover:text-zinc-200 transition-colors">
										{project.title}
									</span>
									<span className="text-xs text-zinc-600 shrink-0 uppercase tracking-widest">{project.category}</span>
								</div>
								<Link
									href={`/admin/projects/${project.id}/edit`}
									className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
								>
									<Edit className="w-3.5 h-3.5" />
								</Link>
							</div>
						))}
					</div>
				</div>

				{/* Recent Posts */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-heading font-bold text-white tracking-tight">Recent Posts</h2>
						<Link
							href="/admin/blog/new"
							className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-950 bg-white border border-transparent rounded-lg px-4 py-2.5 hover:bg-zinc-200 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
						>
							+ New
						</Link>
					</div>
					<div className="space-y-3">
						{recentPosts.map(post => (
							<div
								key={post.id}
								className="group flex items-center justify-between bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-xl px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
							>
								<div className="flex items-center gap-4 min-w-0">
									<span
										className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
											post.status === 'PUBLISHED'
												? 'bg-green-500/10 text-green-400 border border-green-500/20'
												: 'bg-zinc-800 text-zinc-400 border border-zinc-700'
										}`}
									>
										{post.status}
									</span>
									<span className="text-sm font-semibold text-white truncate group-hover:text-zinc-200 transition-colors">
										{post.title}
									</span>
								</div>
								<Link
									href={`/admin/blog/${post.id}/edit`}
									className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
								>
									<Edit className="w-3.5 h-3.5" />
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
