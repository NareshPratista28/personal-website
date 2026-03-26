import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const project = await prisma.project.findUnique({ where: { id } })
	if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	return NextResponse.json(project)
}

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id } = await params
	const body = await req.json()
	const { title, category, description, imageUrl, demoUrl, githubUrl, status, order } = body

	const project = await prisma.project.update({
		where: { id },
		data: { title, category, description, imageUrl, demoUrl, githubUrl, status, order },
	})
	revalidatePath('/')

	return NextResponse.json(project)
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id } = await params
	await prisma.project.delete({ where: { id } })
	revalidatePath('/')
	return NextResponse.json({ success: true })
}
