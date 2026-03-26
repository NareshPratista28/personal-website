'use client'

import Image from 'next/image'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)

		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
		})

		setLoading(false)

		if (result?.error) {
			setError('Invalid email or password.')
		} else {
			router.push('/admin')
			router.refresh()
		}
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
			{/* Background grid */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

			<div className="relative w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-10 flex flex-col items-center">
					<div className="relative h-10 w-36">
						<Image
							src="/logo_2024.png"
							alt="Logo"
							fill
							priority
							className="object-contain object-center"
						/>
					</div>
					<p className="text-xs text-zinc-500 tracking-[0.25em] uppercase mt-3">
						Editorial CMS
					</p>
				</div>

				{/* Card */}
				<div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
					<h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
					<p className="text-sm text-zinc-500 mb-8">Sign in to your admin dashboard</p>

					{error && (
						<div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div className="space-y-1.5">
							<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
								<input
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
									placeholder="admin@portfolio.com"
									className="w-full bg-zinc-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
								/>
							</div>
						</div>

						{/* Password */}
						<div className="space-y-1.5">
							<label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
									placeholder="••••••••"
									className="w-full bg-zinc-800 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/40 transition-colors"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
								>
									{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-white text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
						>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Signing In...</span>
								</>
							) : (
								'Sign In'
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
