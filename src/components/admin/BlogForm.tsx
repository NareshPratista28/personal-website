'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

const RichTextEditor = dynamic(
	() => import('@/components/admin/RichTextEditor'),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-48 bg-zinc-900 border border-white/10 rounded-lg animate-pulse" />
		),
	},
)

type BlogFormData = {
	id?: string
	title: string
	slug: string
	excerpt: string
	content: string
	coverImageUrl: string
	status: 'DRAFT' | 'PUBLISHED'
}

function slugify(str: string) {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

export default function BlogForm({ initial }: { initial?: BlogFormData }) {
	const router = useRouter()
	const isEdit = !!initial?.id

	const [form, setForm] = useState<BlogFormData>(
		initial ?? {
			title: '',
			slug: '',
			excerpt: '',
			content: '',
			coverImageUrl: '',
			status: 'DRAFT',
		},
	)
	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [error, setError] = useState('')
	const [uploading, setUploading] = useState(false)
	const [autoSlug, setAutoSlug] = useState(!isEdit)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	function set(key: keyof BlogFormData, value: string) {
		setForm(f => ({ ...f, [key]: value }))
	}

	useEffect(() => {
		if (autoSlug && form.title) {
			set('slug', slugify(form.title))
		}
	}, [form.title, autoSlug])

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		setUploading(true)
		const fd = new FormData()
		fd.append('file', file)
		const res = await fetch('/api/upload', { method: 'POST', body: fd })
		const data = await res.json()
		if (data.url) set('coverImageUrl', data.url)
		setUploading(false)
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)

		const method = isEdit ? 'PUT' : 'POST'
		const url = isEdit ? `/api/blog/${initial!.id}` : '/api/blog'

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

		router.push('/admin/blog')
		router.refresh()
	}

	async function handleDelete() {
		setShowDeleteConfirm(false)
		setDeleting(true)
		await fetch(`/api/blog/${initial!.id}`, { method: 'DELETE' })
		router.push('/admin/blog')
		router.refresh()
	}

	return (
		<div className="p-8 max-w-3xl">
			<ConfirmDialog
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				isLoading={deleting}
				title="Delete Blog Post"
				description={`Are you sure you want to delete "${form.title}"? This will permanently remove the post from your website.`}
			/>
			<Link
				href="/admin/blog"
				className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Blog
			</Link>

			<h1 className="text-3xl font-black text-white mb-8">
				{isEdit ? 'Edit Post' : 'New Post'}
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
						placeholder="Post title"
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
							Slug *
						</label>
						<button
							type="button"
							onClick={() => setAutoSlug(!autoSlug)}
							className="text-xs text-zinc-500 hover:text-white transition-colors"
						>
							{autoSlug ? '✓ Auto-generating' : 'Auto-generate'}
						</button>
					</div>
					<input
						type="text"
						required
						value={form.slug}
						onChange={e => {
							setAutoSlug(false)
							set('slug', e.target.value)
						}}
						placeholder="post-slug-url"
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-400 placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors font-mono"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Excerpt *
					</label>
					<textarea
						required
						rows={2}
						value={form.excerpt}
						onChange={e => set('excerpt', e.target.value)}
						placeholder="Short description for the post"
						className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors resize-none"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Cover Image
					</label>
					{form.coverImageUrl && (
						<div className="w-full h-40 rounded-lg overflow-hidden border border-white/10 mb-2">
							<img
								src={form.coverImageUrl}
								alt="cover"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="flex gap-3">
						<input
							type="text"
							value={form.coverImageUrl}
							onChange={e => set('coverImageUrl', e.target.value)}
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

				<div className="space-y-2">
					<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
						Content *
					</label>
					<RichTextEditor
						content={form.content}
						onChange={html => set('content', html)}
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
						{isEdit ? 'Save Changes' : 'Publish Post'}
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
