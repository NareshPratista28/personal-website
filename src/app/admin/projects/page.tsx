import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import ProjectsFilter from '@/components/admin/ProjectsFilter'

export default async function AdminProjectsPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: string }>
}) {
	const { status } = await searchParams
	const filter = status === 'published' ? 'PUBLISHED' : status === 'drafts' ? 'DRAFT' : undefined

	const projects = await prisma.project.findMany({
		where: filter ? { status: filter } : undefined,
		orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
	})

	const [publishedCount, draftCount, totalCount] = await Promise.all([
		prisma.project.count({ where: { status: 'PUBLISHED' } }),
		prisma.project.count({ where: { status: 'DRAFT' } }),
		prisma.project.count(),
	])

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex items-end justify-between mb-8">
				<div>
					<p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
						Curated Portfolio
					</p>
					<h1 className="text-4xl font-black text-white">Project Index</h1>
				</div>
				<Link
					href="/admin/projects/new"
					className="flex items-center gap-2 bg-white text-black font-bold text-xs tracking-widest uppercase px-5 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
				>
					<Plus className="w-3.5 h-3.5" />
					New Project
				</Link>
			</div>

			{/* Filter tabs */}
			<ProjectsFilter
				totalCount={totalCount}
				publishedCount={publishedCount}
				draftCount={draftCount}
				currentStatus={status}
			/>

			{/* Projects list */}
			<div className="space-y-4 mt-6">
				{projects.length === 0 ? (
					<div className="text-center py-24 text-zinc-600">
						<p className="text-sm">No projects yet.</p>
						<Link
							href="/admin/projects/new"
							className="inline-block mt-4 text-white text-sm underline"
						>
							Create your first project
						</Link>
					</div>
				) : (
					projects.map((project, i) => (
						<div
							key={project.id}
							className={`relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-white/20 ${i === 0 ? 'min-h-56' : ''}`}
						>
							{/* Featured card for first project */}
							{i === 0 ? (
								<div className="flex flex-col justify-end p-6 min-h-56 relative">
									{project.imageUrl && (
										<div
											className="absolute inset-0 bg-cover bg-center opacity-30"
											style={{ backgroundImage: `url(${project.imageUrl})` }}
										/>
									)}
									<div className="relative z-10">
										<div className="flex gap-2 mb-3">
											<span className="text-xs font-bold tracking-widest uppercase border border-white/30 text-white rounded-full px-3 py-1">
												{project.status}
											</span>
											<span className="text-xs font-bold tracking-widest uppercase border border-white/30 text-white rounded-full px-3 py-1">
												{project.category}
											</span>
										</div>
										<h2 className="text-3xl font-black text-white mb-2">{project.title}</h2>
										<p className="text-sm text-zinc-400 max-w-md">{project.description}</p>
									</div>
									<Link
										href={`/admin/projects/${project.id}/edit`}
										className="absolute bottom-5 right-5 flex items-center gap-2 bg-zinc-800 border border-white/20 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
									>
										<Edit className="w-3.5 h-3.5" />
										Edit Project
									</Link>
								</div>
							) : (
								// Smaller cards for rest
								<div className="flex items-center justify-between px-6 py-5">
									<div className="min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
												{project.category}
											</span>
											<span className="text-zinc-700">·</span>
											<span className="text-xs text-zinc-600">
												{new Date(project.createdAt).toLocaleDateString('en-US', {
													month: 'short',
													year: '2-digit',
												})}
											</span>
										</div>
										<h3 className="text-base font-bold text-white truncate">{project.title}</h3>
										<p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
											{project.description}
										</p>
									</div>
									<Link
										href={`/admin/projects/${project.id}/edit`}
										className="shrink-0 ml-4 text-zinc-500 hover:text-white transition-colors"
									>
										<Edit className="w-4 h-4" />
									</Link>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	)
}
