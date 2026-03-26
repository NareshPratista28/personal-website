import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/blog/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const post = await prisma.blogPost.findUnique({ where: { id } })
	if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	return NextResponse.json(post)
}

// PUT /api/blog/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id } = await params
	const body = await req.json()
	const { title, slug, excerpt, content, coverImageUrl, status } = body

	const current = await prisma.blogPost.findUnique({ where: { id } })
	if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

	// Set publishedAt when transitioning to PUBLISHED
	const publishedAt =
		status === 'PUBLISHED' && current.status !== 'PUBLISHED'
			? new Date()
			: current.publishedAt

	const post = await prisma.blogPost.update({
		where: { id },
		data: { title, slug, excerpt, content, coverImageUrl, status, publishedAt },
	})

	return NextResponse.json(post)
}

// DELETE /api/blog/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id } = await params
	await prisma.blogPost.delete({ where: { id } })
	return NextResponse.json({ success: true })
}
