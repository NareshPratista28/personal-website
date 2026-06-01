'use client'

import { motion } from 'framer-motion'

export default function AdminLoading() {
	return (
		<div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8">
			<motion.div
				className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full mb-6"
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="text-zinc-400 font-medium tracking-wider uppercase text-xs"
			>
				Loading Data
			</motion.div>
		</div>
	)
}
