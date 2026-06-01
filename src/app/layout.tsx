import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
	title: 'Naresh Pratista | Portfolio',
	description: 'Personal Website and Project Portfolio',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${outfit.variable} font-sans bg-zinc-950 text-zinc-50 antialiased selection:bg-white/20`}
				suppressHydrationWarning
			>
				<Navbar />
				<main className="relative min-h-screen selection:bg-white/20">{children}</main>
			</body>
		</html>
	)
}
