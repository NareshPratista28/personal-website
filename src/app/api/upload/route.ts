import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
	try {
		const session = await auth()
		if (!session)
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const formData = await req.formData()
		const file = formData.get('file') as File | null

		if (!file)
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })

		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/webp',
			'image/gif',
			'image/svg+xml',
		]
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
		}

		const maxSize = 5 * 1024 * 1024
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File too large (max 5MB)' },
				{ status: 400 },
			)
		}

		// Upload the file to Vercel Blob
		const blob = await put(file.name, file, {
			access: 'public',
		})

		return NextResponse.json({ url: blob.url })
	} catch (error: any) {
		console.error('Error in upload API:', error)
		return NextResponse.json(
			{ error: error.message || 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
