import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
	try {
		const session = await auth()
		if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const { updates } = await req.json()
		if (!Array.isArray(updates)) {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
		}

		// Use a transaction to update all orders
		await prisma.$transaction(
			updates.map((u: { id: string; order: number }) =>
				prisma.project.update({
					where: { id: u.id },
					data: { order: u.order },
				})
			)
		)

		revalidatePath('/')
		revalidatePath('/admin/projects')
		
		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error('Reorder error:', error)
		return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 })
	}
}
