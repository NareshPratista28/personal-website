import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProjectsFilter from '@/components/admin/ProjectsFilter'
import ProjectListClient from '@/components/admin/ProjectListClient'

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
			<div className="mt-6">
				<ProjectListClient initialProjects={projects} />
			</div>
		</div>
	)
}
