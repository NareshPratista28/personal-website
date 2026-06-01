'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, ArrowUp, ArrowDown, Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from './ConfirmDialog'

type Project = {
	id: string
	title: string
	category: string
	description: string
	imageUrl: string | null
	status: string
	order: number
	createdAt: Date
}

export default function ProjectListClient({ initialProjects }: { initialProjects: Project[] }) {
	const [projects, setProjects] = useState(initialProjects)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const router = useRouter()

	const filteredProjects = projects.filter(p => 
		p.title.toLowerCase().includes(search.toLowerCase()) || 
		p.description.toLowerCase().includes(search.toLowerCase()) ||
		p.category.toLowerCase().includes(search.toLowerCase())
	)

	async function move(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index === 0) return
		if (direction === 'down' && index === projects.length - 1) return

		const newProjects = [...projects]
		const targetIndex = direction === 'up' ? index - 1 : index + 1
		
		// Swap
		const temp = newProjects[index]
		newProjects[index] = newProjects[targetIndex]
		newProjects[targetIndex] = temp

		// Update order values sequentially to be safe
		newProjects.forEach((p, i) => p.order = i)
		setProjects(newProjects)

		setLoading(true)
		await fetch('/api/projects/reorder', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				updates: newProjects.map((p, i) => ({ id: p.id, order: i }))
			})
		})
		setLoading(false)
		router.refresh()
	}

	async function handleDelete() {
		if (!deletingId) return
		setIsDeleting(true)
		await fetch(`/api/projects/${deletingId}`, { method: 'DELETE' })
		setProjects(p => p.filter(x => x.id !== deletingId))
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
					placeholder="Search projects by title, category, or description..."
					className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 transition-colors outline-none"
				/>
				{loading && (
					<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
				)}
			</div>

			<ConfirmDialog
				isOpen={!!deletingId}
				onClose={() => setDeletingId(null)}
				onConfirm={handleDelete}
				isLoading={isDeleting}
				title="Delete Project"
				description="Are you sure you want to delete this project? This action cannot be undone."
			/>

			<div className="space-y-4">
				{filteredProjects.length === 0 ? (
					<div className="text-center py-24 text-zinc-600 border border-dashed border-white/10 rounded-xl">
						<p className="text-sm">No projects found.</p>
					</div>
				) : (
					filteredProjects.map((project, i) => (
						<div
							key={project.id}
							className="group relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-white/20 flex flex-col md:flex-row md:items-center justify-between p-5"
						>
							<div className="flex-1 min-w-0 pr-4">
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded-full">
										{project.category}
									</span>
									<span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${project.status === 'PUBLISHED' ? 'text-green-400 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'}`}>
										{project.status}
									</span>
								</div>
								<h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
								<p className="text-sm text-zinc-500 line-clamp-1 mt-0.5">
									{project.description}
								</p>
							</div>

							<div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
								{/* Reordering Controls (Only show if not searching to prevent weird sorting bugs) */}
								{!search && (
									<div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 mr-2 border border-white/5">
										<button
											onClick={() => move(i, 'up')}
											disabled={i === 0 || loading}
											className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
										>
											<ArrowUp className="w-3.5 h-3.5" />
										</button>
										<button
											onClick={() => move(i, 'down')}
											disabled={i === filteredProjects.length - 1 || loading}
											className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
										>
											<ArrowDown className="w-3.5 h-3.5" />
										</button>
									</div>
								)}

								<Link
									href={`/admin/projects/${project.id}/edit`}
									className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
								>
									<Edit className="w-4 h-4" />
								</Link>
								<button
									onClick={() => setDeletingId(project.id)}
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
