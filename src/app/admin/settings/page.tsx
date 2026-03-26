import { prisma } from '@/lib/db'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
	const settingsRaw = await prisma.siteSettings.findMany()
	const settings = Object.fromEntries(settingsRaw.map(s => [s.key, s.value]))

	return (
		<div className="p-8 max-w-3xl">
			<div className="mb-8">
				<p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
					Configuration
				</p>
				<h1 className="text-4xl font-black text-white">Settings</h1>
			</div>
			<SettingsForm settings={settings} />
		</div>
	)
}
