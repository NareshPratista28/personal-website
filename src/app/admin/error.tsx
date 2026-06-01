'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Admin Error:', error)
	}, [error])

	return (
		<div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="bg-zinc-900 border border-red-500/20 p-8 rounded-2xl max-w-md w-full flex flex-col items-center shadow-lg"
			>
				<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
					<AlertCircle className="w-8 h-8 text-red-500" />
				</div>
				<h2 className="text-xl font-bold text-white mb-2">Failed to Load Data</h2>
				<p className="text-zinc-400 text-sm mb-8 leading-relaxed">
					{error.message || "An error occurred while loading the dashboard data. Please try again."}
				</p>
				<button
					onClick={() => reset()}
					className="flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
				>
					<RefreshCw className="w-4 h-4" />
					Retry
				</button>
			</motion.div>
		</div>
	)
}
