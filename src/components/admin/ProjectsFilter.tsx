'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProjectsFilter({
	totalCount,
	publishedCount,
	draftCount,
	currentStatus,
}: {
	totalCount: number
	publishedCount: number
	draftCount: number
	currentStatus?: string
}) {
	const router = useRouter()

	const tabs = [
		{ label: 'All', value: undefined, count: totalCount },
		{ label: 'Published', value: 'published', count: publishedCount },
		{ label: 'Drafts', value: 'drafts', count: draftCount },
	]

	return (
		<div className="flex items-center gap-1">
			{tabs.map(tab => {
				const isActive = tab.value === currentStatus || (!tab.value && !currentStatus)
				const href = tab.value ? `/admin/projects?status=${tab.value}` : '/admin/projects'
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
	)
}
