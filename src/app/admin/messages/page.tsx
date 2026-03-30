import { prisma } from '@/lib/db'
import MessageList from './MessageList'
import { Mail } from 'lucide-react'

export default async function AdminMessagesPage() {
	const messages = await prisma.message.findMany({
		orderBy: { createdAt: 'desc' },
	})

	const unreadCount = await prisma.message.count({
		where: { isRead: false },
	})

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
				<div>
					<div className="flex items-center gap-2 mb-2">
                        <span className="w-12 h-px bg-white/30 truncate"></span>
                        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 whitespace-nowrap">
                            Communication hub
                        </p>
                    </div>
					<h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
						Inbound Messages
						{unreadCount > 0 && (
							<span className="inline-flex items-center justify-center bg-white text-black text-xs font-black min-w-[24px] h-[24px] rounded-full px-1.5 align-middle">
								{unreadCount}
							</span>
						)}
					</h1>
				</div>
				<div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-zinc-500 border border-white/5 bg-zinc-900/50 rounded-lg px-5 py-3">
					<Mail className="w-3.5 h-3.5" />
					Total: {messages.length}
				</div>
			</div>

			{/* Message List Component */}
			<div className="max-w-4xl">
				<MessageList initialMessages={messages} />
			</div>
		</div>
	)
}
