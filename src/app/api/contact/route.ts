import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { name, email, phone, subject, message } = body

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 }
			)
		}

		// Save message to database
		const newMessage = await prisma.message.create({
			data: {
				name,
				email,
				phone,
				subject,
				message,
			},
		})

		return NextResponse.json(
			{ message: 'Message sent successfully', id: newMessage.id },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Contact API Error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
