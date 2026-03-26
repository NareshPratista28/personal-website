import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// GET /api/projects
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const status = searchParams.get('status') as 'PUBLISHED' | 'DRAFT' | null

	const projects = await prisma.project.findMany({
		where: status ? { status } : undefined,
		orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
	})

	return NextResponse.json(projects)
}

// POST /api/projects
export async function POST(req: NextRequest) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = await req.json()
	const { title, category, description, imageUrl, demoUrl, githubUrl, status, order } = body

	if (!title || !category || !description) {
		return NextResponse.json({ error: 'Title, category, and description are required' }, { status: 400 })
	}

	const project = await prisma.project.create({
		data: { title, category, description, imageUrl, demoUrl, githubUrl, status, order: order ?? 0 },
	})

	revalidatePath('/')
	return NextResponse.json(project, { status: 201 })
}
