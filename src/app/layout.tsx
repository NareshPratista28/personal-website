import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

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
				className={`${inter.className} bg-black text-white antialiased`}
				suppressHydrationWarning
			>
				<Navbar />
				<main className="relative min-h-screen">{children}</main>
			</body>
		</html>
	)
}
