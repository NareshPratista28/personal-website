import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// GET /api/blog
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const status = searchParams.get('status') as 'PUBLISHED' | 'DRAFT' | null
	const limit = searchParams.get('limit')

	const posts = await prisma.blogPost.findMany({
		where: status ? { status } : undefined,
		orderBy: { publishedAt: 'desc' },
		take: limit ? Number(limit) : undefined,
		select: {
			id: true,
			title: true,
			slug: true,
			excerpt: true,
			coverImageUrl: true,
			status: true,
			publishedAt: true,
			createdAt: true,
		},
	})

	return NextResponse.json(posts)
}

// POST /api/blog
export async function POST(req: NextRequest) {
	const session = await auth()
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = await req.json()
	const { title, slug, excerpt, content, coverImageUrl, status } = body

	if (!title || !slug || !excerpt || !content) {
		return NextResponse.json({ error: 'Title, slug, excerpt, and content are required' }, { status: 400 })
	}

	try {
		const post = await prisma.blogPost.create({
			data: {
				title,
				slug,
				excerpt,
				content,
				coverImageUrl,
				status,
				publishedAt: status === 'PUBLISHED' ? new Date() : null,
			},
		})
		revalidatePath('/')
		return NextResponse.json(post, { status: 201 })
	} catch {
		return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
	}
}
