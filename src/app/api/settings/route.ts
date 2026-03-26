import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/settings
export async function GET() {
	const settings = await prisma.siteSettings.findMany()
	const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
	return NextResponse.json(map)
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body: Record<string, string> = await req.json()

	const updates = Object.entries(body).map(([key, value]) =>
		prisma.siteSettings.upsert({
			where: { key },
			update: { value },
			create: { key, value },
		}),
	)

	await Promise.all(updates)
	return NextResponse.json({ success: true })
}
