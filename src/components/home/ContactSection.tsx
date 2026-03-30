'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Mail01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { sectionMotion } from '@/components/home/motion'

type ContactSectionProps = {
	email: string
	location: string
}

export default function ContactSection({ email, location }: ContactSectionProps) {
	const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)
	const [error, setError] = useState<string | null>(null)

	function set(k: keyof typeof form, v: string) {
		setForm(f => ({ ...f, [k]: v }))
		if (error) setError(null)
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Failed to send message')
			}

			setSent(true)
			setForm({ name: '', email: '', phone: '', subject: '', message: '' })
		} catch (err: any) {
			setError(err.message || 'Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.section
			id="contact"
			className="relative w-full py-24 lg:py-32 bg-black border-t border-white/10 overflow-hidden"
			{...sectionMotion}
		>
			<div className="absolute inset-0 opacity-40 pointer-events-none">
				<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>
				<div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
			</div>

			<div className="container mx-auto px-6 md:px-12 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
					<div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden p-6 md:p-8 flex flex-col justify-between min-h-105">
						<div>
							<div className="flex items-center gap-3 mb-6">
								<span className="w-8 h-0.5 bg-white"></span>
								<span className="text-xs tracking-[0.2em] uppercase text-gray-400">
									Open For Collaboration
								</span>
							</div>
							<h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
								Let&apos;s Build Something Exceptional Together
							</h3>
						</div>

						<div className="relative mt-10 flex-1 rounded-xl border border-white/10 overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-950 to-black">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_40%)]"></div>
							<div className="absolute -left-8 top-8 w-40 h-40 border border-white/20 rounded-full"></div>
							<div className="absolute right-6 bottom-6 w-24 h-24 border border-dashed border-white/30"></div>
							<div className="absolute inset-0 [background:repeating-linear-gradient(135deg,transparent,transparent_14px,rgba(255,255,255,0.06)_14px,rgba(255,255,255,0.06)_15px)]"></div>
						</div>
					</div>

					<div className="lg:col-span-7 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md p-6 md:p-10">
						<div className="flex items-center gap-3 mb-3">
							<span className="w-8 h-0.5 bg-white"></span>
							<span className="text-xs tracking-[0.2em] uppercase text-gray-400">
								Get In Touch
							</span>
						</div>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
							Feel Free to Contact
						</h2>

						{sent ? (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
								<p className="text-white font-bold text-lg">Message sent!</p>
								<p className="text-zinc-500 text-sm mt-2">I&apos;ll get back to you shortly.</p>
								<Button
									onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
									variant="outline"
									className="mt-6 border-white/20 text-white hover:bg-white/10"
								>
									Send another
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								{error && (
									<div className="p-4 bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-lg">
										{error}
									</div>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<input type="text" placeholder="Enter Name" required value={form.name} onChange={e => set('name', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-gray-500 px-1 py-3 outline-none focus:border-white transition-colors" />
									<input type="email" placeholder="Enter Email" required value={form.email} onChange={e => set('email', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-gray-500 px-1 py-3 outline-none focus:border-white transition-colors" />
									<input type="tel" placeholder="Phone (Optional)" value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-gray-500 px-1 py-3 outline-none focus:border-white transition-colors" />
									<input type="text" placeholder="Subject" required value={form.subject} onChange={e => set('subject', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-gray-500 px-1 py-3 outline-none focus:border-white transition-colors" />
								</div>

								<textarea rows={4} placeholder="Your Message" required value={form.message} onChange={e => set('message', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-gray-500 px-1 py-3 outline-none focus:border-white transition-colors resize-none"></textarea>

								<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-4">
									<Button
										type="submit"
										disabled={loading}
										className="bg-white text-black hover:bg-gray-200 rounded-none px-8 py-6 text-sm font-bold tracking-widest uppercase inline-flex items-center gap-3 group"
									>
										{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
										{loading ? 'Sending...' : 'Send Message'}
									</Button>

									<div className="text-sm text-gray-400 flex flex-row gap-3">
										{email && (
											<p className="inline-flex items-center gap-2">
												<HugeiconsIcon icon={Mail01Icon} size={16} />
												{email}
											</p>
										)}
										{location && (
											<p className="inline-flex items-center gap-2">
												<HugeiconsIcon icon={Location01Icon} size={16} />
												{location}
											</p>
										)}
									</div>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</motion.section>
	)
}
