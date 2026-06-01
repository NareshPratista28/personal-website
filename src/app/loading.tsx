'use client'

import { motion } from 'framer-motion'

export default function Loading() {
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950">
			<div className="flex flex-col items-center gap-6">
				<motion.div
					className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
				/>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-white font-heading font-bold tracking-[0.2em] uppercase text-sm"
				>
					Loading
					<motion.span
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
					>
						.
					</motion.span>
					<motion.span
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
					>
						.
					</motion.span>
					<motion.span
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
					>
						.
					</motion.span>
				</motion.div>
			</div>
		</div>
	)
}
