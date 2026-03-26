'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
	LayoutDashboard,
	FolderOpen,
	FileText,
	Settings,
	HelpCircle,
	LogOut,
} from 'lucide-react'

const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
	{
		href: '/admin/projects',
		label: 'Projects',
		icon: FolderOpen,
		exact: false,
	},
	{ href: '/admin/blog', label: 'Blog', icon: FileText, exact: false },
	{ href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
]

export default function AdminSidebar({ userName }: { userName: string }) {
	const pathname = usePathname()

	function isActive(href: string, exact: boolean) {
		if (exact) return pathname === href
		return pathname.startsWith(href)
	}

	return (
		<aside className="fixed left-0 top-0 h-screen w-44 bg-zinc-950 border-r border-white/10 flex flex-col z-50">
			<div className="px-5 pt-6 pb-5 border-b border-white/10">
				<div className="relative h-8 w-28">
					<Image
						src="/logo_2024.png"
						alt="Logo"
						fill
						priority
						className="object-contain object-left"
					/>
				</div>
				<p className="text-[9px] text-zinc-500 tracking-[0.2em] uppercase mt-2">
					Editorial CMS
				</p>
			</div>

			<nav className="flex-1 py-4 px-2 space-y-0.5">
				{navItems.map(({ href, label, icon: Icon, exact }) => {
					const active = isActive(href, exact)
					return (
						<Link
							key={href}
							href={href}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
								active
									? 'bg-white/10 text-white'
									: 'text-zinc-500 hover:text-white hover:bg-white/5'
							}`}
						>
							<Icon className="w-4 h-4 shrink-0" />
							<span>{label}</span>
						</Link>
					)
				})}
			</nav>

			<div className="px-2 pb-6 space-y-1 border-t border-white/10 pt-4">
				<button
					onClick={() => signOut({ callbackUrl: '/admin/login' })}
					className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
				>
					<LogOut className="w-4 h-4 shrink-0" />
					<span>Sign Out</span>
				</button>

				<a
					href="#"
					className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
				>
					<HelpCircle className="w-4 h-4 shrink-0" />
					<span>Support</span>
				</a>
			</div>

			<div className="px-4 pb-5 pt-1">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
						{userName.charAt(0)}
					</div>
					<div className="min-w-0">
						<p className="text-xs font-semibold text-white truncate">
							{userName}
						</p>
						<p className="text-[9px] text-zinc-500 uppercase tracking-widest">
							System Access
						</p>
					</div>
				</div>
			</div>
		</aside>
	)
}
