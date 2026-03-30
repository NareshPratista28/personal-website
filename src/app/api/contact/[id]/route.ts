import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const body = await req.json()
		const { isRead } = body

		const updatedMessage = await prisma.message.update({
			where: { id },
			data: { isRead },
		})

		return NextResponse.json(updatedMessage, { status: 200 })
	} catch (error) {
		console.error('Contact Update Error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		await prisma.message.delete({
			where: { id },
		})

		return NextResponse.json({ message: 'Message deleted' }, { status: 200 })
	} catch (error) {
		console.error('Contact Delete Error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
