import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()

	return (
		<SessionProvider session={session}>
			<div className="min-h-screen bg-zinc-950 flex selection:bg-white/20">
				{/* Sidebar */}
				{session && <AdminSidebar userName={session.user?.name ?? 'Administrator'} />}

				{/* Main content */}
				<main className={`flex-1 min-h-screen overflow-auto ${session ? 'ml-44' : ''}`}>
					{children}
				</main>
			</div>
		</SessionProvider>
	)
}
