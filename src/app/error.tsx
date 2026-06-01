'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="bg-zinc-900/50 border border-red-500/20 p-8 md:p-12 rounded-3xl max-w-lg backdrop-blur-xl flex flex-col items-center shadow-2xl shadow-red-500/5"
			>
				<div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
					<AlertCircle className="w-10 h-10 text-red-500" />
				</div>
				<h2 className="text-2xl font-heading font-bold text-white mb-4">Something went wrong</h2>
				<p className="text-zinc-400 text-sm mb-8 leading-relaxed">
					We apologize for the inconvenience. An unexpected error has occurred while loading this page.
				</p>
				<button
					onClick={() => reset()}
					className="bg-white text-zinc-950 hover:bg-zinc-200 px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
				>
					Try Again
				</button>
			</motion.div>
		</div>
	)
}
