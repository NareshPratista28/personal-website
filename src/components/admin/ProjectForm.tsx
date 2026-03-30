'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type ProjectFormData = {
	id?: string
	title: string
	category: string
	description: string
	imageUrl: string
	demoUrl: string
	githubUrl: string
	status: 'DRAFT' | 'PUBLISHED'
	order: number
}

const CATEGORIES = ['Web App', 'Mobile App', 'UI/UX', 'Backend', 'Other']

export default function ProjectForm({
	initial,
}: {
	initial?: ProjectFormData
}) {
	const router = useRouter()
	const isEdit = !!initial?.id

	const [form, setForm] = useState<ProjectFormData>(
		initial ?? {
			title: '',
			category: 'Web App',
			description: '',
			imageUrl: '',
			demoUrl: '',
			githubUrl: '',
			status: 'DRAFT',
			order: 0,
		},
	)
	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [error, setError] = useState('')
	const [uploading, setUploading] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	function set(key: keyof ProjectFormData, value: string | number) {
		setForm(f => ({ ...f, [key]: value }))
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return

		setUploading(true)
		const fd = new FormData()
		fd.append('file', file)
		const res = await fetch('/api/upload', { method: 'POST', body: fd })
		const data = await res.json()
		if (data.url) set('imageUrl', data.url)
		setUploading(false)
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)

		const method = isEdit ? 'PUT' : 'POST'
		const url = isEdit ? `/api/projects/${initial!.id}` : '/api/projects'

		const res = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})

		setLoading(false)

		if (!res.ok) {
			const d = await res.json()
			setError(d.error ?? 'Something went wrong')
			return
		}

		router.push('/admin/projects')
		router.refresh()
	}

	async function handleDelete() {
		setShowDeleteConfirm(false)
		setDeleting(true)
		await fetch(`/api/projects/${initial!.id}`, { method: 'DELETE' })
		router.push('/admin/projects')
		router.refresh()
	}

	return (
		<div className="p-8 max-w-3xl">
			<ConfirmDialog
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				isLoading={deleting}
				title="Delete Project"
				description={`Are you sure you want to delete "${form.title}"? This action is permanent and all associated data will be removed.`}
			/>
			<Link
				href="/admin/projects"
				className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Projects
			</Link>

			<h1 className="text-3xl font-black text-white mb-8">
				{isEdit ? 'Edit Project' : 'New Project'}
			</h1>

			{error && (
				<div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Title *
					</label>
					<input
						type="text"
						required
						value={form.title}
						onChange={e => set('title', e.target.value)}
						placeholder="Project title"
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Category *
					</label>
					<select
						value={form.category}
						onChange={e => set('category', e.target.value)}
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors"
					>
						{CATEGORIES.map(c => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Description *
					</label>
					<textarea
						required
						rows={4}
						value={form.description}
						onChange={e => set('description', e.target.value)}
						placeholder="Brief project description"
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors resize-none"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Cover Image
					</label>
					{form.imageUrl && (
						<div className="w-full h-40 rounded-lg overflow-hidden border border-white/10 mb-2">
							<img
								src={form.imageUrl}
								alt="cover"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="flex gap-3">
						<input
							type="text"
							value={form.imageUrl}
							onChange={e => set('imageUrl', e.target.value)}
							placeholder="https://... or upload below"
							className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
						/>
						<label className="shrink-0 cursor-pointer flex items-center gap-2 bg-zinc-800 border border-white/10 text-white text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-lg hover:bg-zinc-700 transition-colors">
							{uploading ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								'Upload'
							)}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
							/>
						</label>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
							Demo URL
						</label>
						<input
							type="url"
							value={form.demoUrl}
							onChange={e => set('demoUrl', e.target.value)}
							placeholder="https://..."
							className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
							GitHub URL
						</label>
						<input
							type="url"
							value={form.githubUrl}
							onChange={e => set('githubUrl', e.target.value)}
							placeholder="https://github.com/..."
							className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Display Order
					</label>
					<input
						type="number"
						value={form.order}
						onChange={e => set('order', Number(e.target.value))}
						className="w-32 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Status
					</label>
					<div className="flex gap-3">
						{(['DRAFT', 'PUBLISHED'] as const).map(s => (
							<button
								key={s}
								type="button"
								onClick={() => set('status', s)}
								className={`px-5 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
									form.status === s
										? 'bg-white text-black'
										: 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
								}`}
							>
								{s}
							</button>
						))}
					</div>
				</div>

				<div className="flex items-center gap-4 pt-4 border-t border-white/10">
					<button
						type="submit"
						disabled={loading}
						className="flex items-center gap-2 bg-white text-black font-bold text-xs tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-60 transition-colors"
					>
						{loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
						{isEdit ? 'Save Changes' : 'Create Project'}
					</button>

					{isEdit && (
						<button
							type="button"
							onClick={() => setShowDeleteConfirm(true)}
							disabled={deleting}
							className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold tracking-widest uppercase transition-colors"
						>
							{deleting ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<Trash2 className="w-3.5 h-3.5" />
							)}
							Delete
						</button>
					)}
				</div>
			</form>
		</div>
	)
}
