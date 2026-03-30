'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	description: string
	isLoading?: boolean
}

export default function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	isLoading = false,
}: ConfirmDialogProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					{/* Dialog Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
					>
                        {/* Progress line if loading */}
                        {isLoading && (
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="absolute top-0 left-0 right-0 h-0.5 bg-white/30"
                            />
                        )}

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-black text-white mb-2 leading-tight">
                                    {title}
                                </h2>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>

						<div className="flex items-center justify-end gap-3 mt-8">
							<button
								onClick={onClose}
								disabled={isLoading}
								className="px-5 py-2.5 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
							>
								Cancel
							</button>
							<Button
								onClick={onConfirm}
								disabled={isLoading}
								className={`bg-white text-black hover:bg-zinc-200 font-black text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
									isLoading ? 'opacity-70 cursor-not-allowed' : ''
								}`}
							>
								{isLoading ? (
									<>
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										Processing...
									</>
								) : (
									'Confirm Delete'
								)}
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
