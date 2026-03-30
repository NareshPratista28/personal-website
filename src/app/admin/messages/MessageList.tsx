'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MailOpen, Trash2, User, Phone, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Message = {
	id: string
	name: string
	email: string
	phone: string | null
	subject: string
	message: string
	isRead: boolean
	createdAt: Date
}

export default function MessageList({ initialMessages }: { initialMessages: Message[] }) {
	const [messages, setMessages] = useState(initialMessages)
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [loading, setLoading] = useState<string | null>(null)
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const router = useRouter()

	async function toggleRead(id: string, currentRead: boolean) {
		setLoading(id)
		try {
			const res = await fetch(`/api/contact/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isRead: !currentRead }),
			})

			if (res.ok) {
				setMessages(msgs =>
					msgs.map(m => (m.id === id ? { ...m, isRead: !currentRead } : m))
				)
				router.refresh()
			}
		} catch (err) {
			console.error('Failed to update message:', err)
		} finally {
			setLoading(null)
		}
	}

	async function handleDelete() {
		if (!deleteId) return

		setLoading(deleteId)
		try {
			const res = await fetch(`/api/contact/${deleteId}`, {
				method: 'DELETE',
			})

			if (res.ok) {
				setMessages(msgs => msgs.filter(m => m.id !== deleteId))
				setDeleteId(null)
				router.refresh()
			}
		} catch (err) {
			console.error('Failed to delete message:', err)
		} finally {
			setLoading(null)
		}
	}

	return (
		<div className="space-y-4">
			<ConfirmDialog
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleDelete}
				isLoading={loading === deleteId}
				title="Confirm Deletion"
				description="Are you sure you want to delete this message? This action is permanent and cannot be undone."
			/>
			{messages.length === 0 ? (
				<div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-white/5">
					<Mail className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
					<p className="text-zinc-500 text-sm">No messages received yet.</p>
				</div>
			) : (
				messages.map(msg => (
					<div
						key={msg.id}
						className={`group relative bg-zinc-950 border transition-all duration-300 rounded-xl overflow-hidden ${
							msg.isRead ? 'border-white/5 opacity-80' : 'border-white/20 ring-1 ring-white/10'
						} ${expandedId === msg.id ? 'bg-zinc-900 border-white/30' : 'hover:border-white/10'}`}
					>
						{/* Unread indicator */}
						{!msg.isRead && (
							<div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
						)}

						<div className="p-5 md:p-6">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
								<div className="flex-1 min-w-0" onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}>
									<div className="flex items-center gap-3 mb-2">
										<span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${
											msg.isRead ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black'
										}`}>
											{msg.isRead ? 'Read' : 'New'}
										</span>
										<span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
											<Calendar className="w-3 h-3" />
											{format(new Date(msg.createdAt), 'MMM dd, h:mm a')}
										</span>
									</div>
									<h3 className={`text-lg font-bold truncate ${msg.isRead ? 'text-zinc-400' : 'text-white'}`}>
										{msg.subject}
									</h3>
									<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-zinc-500">
										<span className="flex items-center gap-1.5">
											<User className="w-3.5 h-3.5" />
											{msg.name}
										</span>
										<span className="flex items-center gap-1.5">
											<Mail className="w-3.5 h-3.5" />
											{msg.email}
										</span>
										{msg.phone && (
											<span className="flex items-center gap-1.5">
												<Phone className="w-3.5 h-3.5" />
												{msg.phone}
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 shrink-0 self-end md:self-center">
									<button
										onClick={() => toggleRead(msg.id, msg.isRead)}
										disabled={loading === msg.id}
										className={`p-2 rounded-lg transition-colors ${
											msg.isRead 
												? 'text-zinc-500 hover:bg-white/5 hover:text-white' 
												: 'text-white hover:bg-white/10'
										}`}
										title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
									>
										{msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
									</button>
									<button
										onClick={() => setDeleteId(msg.id)}
										disabled={loading === msg.id}
										className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
										title="Delete message"
									>
										<Trash2 className="w-4 h-4" />
									</button>
									<button
										onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
										className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
									>
										{expandedId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
									</button>
								</div>
							</div>

							{expandedId === msg.id && (
								<div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
									<p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base selection:bg-white selection:text-black">
										{msg.message}
									</p>
									<div className="mt-8 flex justify-start">
										<a 
											href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
											className="bg-white text-black text-xs font-black tracking-[0.2em] uppercase px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
										>
											Reply via Email
										</a>
									</div>
								</div>
							)}
						</div>
					</div>
				))
			)}
		</div>
	)
}
