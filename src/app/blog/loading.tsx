import { Loader2 } from 'lucide-react'

export default function BlogLoading() {
	return (
		<main className="min-h-screen bg-black flex items-center justify-center">
			<div className="flex flex-col items-center gap-4 text-zinc-500">
				<Loader2 className="w-8 h-8 animate-spin" />
				<p className="text-sm font-semibold tracking-widest uppercase">Loading Article...</p>
			</div>
		</main>
	)
}
