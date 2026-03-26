'use client'

import { useState } from 'react'
import { Loader2, Plus, X } from 'lucide-react'

type Settings = Record<string, string>

export default function SettingsForm({ settings }: { settings: Settings }) {
	const [form, setForm] = useState<Settings>(settings)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [techList, setTechList] = useState<string[]>(() => {
		try {
			return JSON.parse(settings.techStack || '[]')
		} catch {
			return []
		}
	})
	const [newTech, setNewTech] = useState('')
	const [activeTab, setActiveTab] = useState<
		'profile' | 'social' | 'tech' | 'contact'
	>('profile')

	function set(key: string, value: string) {
		setForm(f => ({ ...f, [key]: value }))
	}

	function addTech() {
		if (!newTech.trim()) return
		const updated = [...techList, newTech.trim()]
		setTechList(updated)
		setForm(f => ({ ...f, techStack: JSON.stringify(updated) }))
		setNewTech('')
	}

	function removeTech(idx: number) {
		const updated = techList.filter((_, i) => i !== idx)
		setTechList(updated)
		setForm(f => ({ ...f, techStack: JSON.stringify(updated) }))
	}

	async function handleSave() {
		setLoading(true)
		setSuccess(false)
		await fetch('/api/settings', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})
		setLoading(false)
		setSuccess(true)
		setTimeout(() => setSuccess(false), 3000)
	}

	const tabs = [
		{ key: 'profile', label: 'Profile' },
		{ key: 'social', label: 'Social Links' },
		{ key: 'tech', label: 'Tech Stack' },
		{ key: 'contact', label: 'Contact' },
	] as const

	return (
		<div className="space-y-8">
			<div className="flex gap-1 bg-zinc-900 border border-white/10 rounded-xl p-1">
				{tabs.map(tab => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setActiveTab(tab.key)}
						className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
							activeTab === tab.key
								? 'bg-white text-black'
								: 'text-zinc-500 hover:text-white'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{activeTab === 'profile' && (
				<div className="space-y-5">
					<Field
						label="Hero Name (ALL CAPS)"
						value={form.heroName ?? ''}
						onChange={v => set('heroName', v)}
					/>
					<Field
						label="Hero Tagline (e.g. Software Engineer)"
						value={form.heroTagline ?? ''}
						onChange={v => set('heroTagline', v)}
					/>
					<Field
						label="Hero Bio (short)"
						value={form.heroBio ?? ''}
						onChange={v => set('heroBio', v)}
						multiline
					/>
					<Field
						label="About Name"
						value={form.aboutName ?? ''}
						onChange={v => set('aboutName', v)}
					/>
					<Field
						label="About Role"
						value={form.aboutRole ?? ''}
						onChange={v => set('aboutRole', v)}
					/>
					<Field
						label="About Bio"
						value={form.aboutBio ?? ''}
						onChange={v => set('aboutBio', v)}
						multiline
					/>
					<Field
						label="Profile Image URL"
						value={form.aboutImage ?? ''}
						onChange={v => set('aboutImage', v)}
						placeholder="/image.png"
					/>
					<Field
						label="CV / Resume URL"
						value={form.cvUrl ?? ''}
						onChange={v => set('cvUrl', v)}
						placeholder="https://..."
					/>
					<Field
						label="Site Title (browser tab)"
						value={form.siteTitle ?? ''}
						onChange={v => set('siteTitle', v)}
					/>
					<Field
						label="Site Description (SEO)"
						value={form.siteDescription ?? ''}
						onChange={v => set('siteDescription', v)}
					/>
				</div>
			)}

			{activeTab === 'social' && (
				<div className="space-y-5">
					<Field
						label="GitHub URL"
						value={form.githubUrl ?? ''}
						onChange={v => set('githubUrl', v)}
						placeholder="https://github.com/..."
					/>
					<Field
						label="LinkedIn URL"
						value={form.linkedinUrl ?? ''}
						onChange={v => set('linkedinUrl', v)}
						placeholder="https://linkedin.com/in/..."
					/>
					<Field
						label="Email"
						value={form.email ?? ''}
						onChange={v => set('email', v)}
						placeholder="you@example.com"
					/>
				</div>
			)}

			{activeTab === 'tech' && (
				<div className="space-y-4">
					<div className="flex gap-2">
						<input
							type="text"
							value={newTech}
							onChange={e => setNewTech(e.target.value)}
							onKeyDown={e =>
								e.key === 'Enter' && (e.preventDefault(), addTech())
							}
							placeholder="Add technology..."
							className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
						/>
						<button
							type="button"
							onClick={addTech}
							className="shrink-0 flex items-center gap-2 bg-white text-black font-bold text-xs tracking-widest uppercase px-4 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
						>
							<Plus className="w-3.5 h-3.5" />
							Add
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{techList.map((tech, idx) => (
							<span
								key={idx}
								className="flex items-center gap-2 bg-zinc-900 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
							>
								{tech}
								<button
									type="button"
									onClick={() => removeTech(idx)}
									className="text-zinc-500 hover:text-red-400 transition-colors"
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
					</div>
					{techList.length === 0 && (
						<p className="text-zinc-600 text-sm">
							No technologies yet. Add some above.
						</p>
					)}
				</div>
			)}

			{activeTab === 'contact' && (
				<div className="space-y-5">
					<Field
						label="Contact Email"
						value={form.email ?? ''}
						onChange={v => set('email', v)}
						placeholder="you@example.com"
					/>
					<Field
						label="Location"
						value={form.location ?? ''}
						onChange={v => set('location', v)}
						placeholder="City, Country"
					/>
				</div>
			)}

			<div className="flex items-center gap-4 pt-4 border-t border-white/10">
				<button
					onClick={handleSave}
					disabled={loading}
					className="flex items-center gap-2 bg-white text-black font-bold text-xs tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-60 transition-colors"
				>
					{loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
					Save Settings
				</button>
				{success && (
					<p className="text-sm text-emerald-400 font-semibold">
						✓ Saved successfully
					</p>
				)}
			</div>
		</div>
	)
}

function Field({
	label,
	value,
	onChange,
	placeholder,
	multiline,
}: {
	label: string
	value: string
	onChange: (v: string) => void
	placeholder?: string
	multiline?: boolean
}) {
	const className =
		'w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors'

	return (
		<div className="space-y-2">
			<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
				{label}
			</label>
			{multiline ? (
				<textarea
					rows={3}
					value={value}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
					className={`${className} resize-none`}
				/>
			) : (
				<input
					type="text"
					value={value}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
					className={className}
				/>
			)}
		</div>
	)
}
