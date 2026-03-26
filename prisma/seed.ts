import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const DEFAULT_SETTINGS = {
	siteTitle: 'Portfolio | Naresh Pratista',
	siteDescription: 'Software Developer Portfolio',
	heroName: 'NARESH PRATISTA',
	heroTagline: 'Software Engineer',
	heroBio: "Turning it works on my machine into it works everywhere.",
	aboutName: "Naresh Pratista",
	aboutRole: "Software Engineer",
	aboutBio:
		'I am a passionate software developer based in Indonesia, specializing in building exceptional digital experiences. I focus on writing clean, elegant, and efficient code to solve complex problems while maintaining a pixel-perfect design.',
	aboutImage: '/image.png',
	cvUrl: '#',
	email: 'nareshpratista.contact@gmail.com',
	location: 'Bekasi, Indonesia',
	githubUrl: '#',
	linkedinUrl: '#',
	techStack: JSON.stringify([
		'JavaScript',
		'HTML / CSS / SCSS',
		'React JS',
		'Node JS',
		'Express',
		'MySQL',
		'Git',
		'PWA',
		'Flutter',
		'Next JS',
		'TypeScript',
	]),
}

const DEFAULT_PROJECTS = [
	{
		title: 'Fintech Dashboard Analytics',
		category: 'Web App',
		description:
			'A comprehensive financial dashboard for real-time data tracking and analytics.',
		status: 'PUBLISHED' as const,
		order: 1,
	},
	{
		title: 'E-Commerce Mobile App',
		category: 'Mobile App',
		description:
			'Modern and fast mobile shopping experience built with React Native.',
		status: 'PUBLISHED' as const,
		order: 2,
	},
	{
		title: 'Healthcare Landing Page',
		category: 'UI/UX',
		description:
			'A clean and accessible user interface for a hospital management system.',
		status: 'PUBLISHED' as const,
		order: 3,
	},
]

const DEFAULT_POSTS = [
	{
		title: 'Understanding React Server Components in Next.js 14',
		slug: 'understanding-react-server-components-nextjs-14',
		excerpt:
			'Explore the power of server components and how they can optimize your web applications significantly.',
		content:
			'<p>React Server Components are a new paradigm for building React applications...</p>',
		status: 'PUBLISHED' as const,
		publishedAt: new Date('2023-10-12'),
	},
	{
		title: 'Building Scalable Microservices with Node & Express',
		slug: 'building-scalable-microservices-node-express',
		excerpt:
			'Learn the architectural patterns for building robust backend services capable of handling millions of requests.',
		content:
			'<p>Microservices architecture has become a popular choice for building scalable applications...</p>',
		status: 'PUBLISHED' as const,
		publishedAt: new Date('2023-09-24'),
	},
	{
		title: 'The Future of Styling: Tailwind CSS Advanced Tips',
		slug: 'future-styling-tailwind-css-advanced-tips',
		excerpt:
			'Dive deep into Tailwind CSS features to write cleaner, more maintainable utility-first styles.',
		content:
			'<p>Tailwind CSS has revolutionized the way we think about styling...</p>',
		status: 'PUBLISHED' as const,
		publishedAt: new Date('2023-08-05'),
	},
]

async function main() {
	console.log('🌱 Seeding database...')

	// Create admin user
	const hashedPassword = await bcrypt.hash('admin123', 12)
	const user = await prisma.user.upsert({
		where: { email: 'admin@portfolio.com' },
		update: {},
		create: {
			email: 'admin@portfolio.com',
			password: hashedPassword,
			name: 'Administrator',
		},
	})
	console.log('✅ Admin user created:', user.email)
	console.log('   Password: admin123')

	// Seed settings
	for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
		await prisma.siteSettings.upsert({
			where: { key },
			update: { value },
			create: { key, value },
		})
	}
	console.log('✅ Site settings seeded')

	// Seed projects
	await prisma.project.deleteMany()
	for (const project of DEFAULT_PROJECTS) {
		await prisma.project.create({ data: project })
	}
	console.log('✅ Projects seeded')

	// Seed blog posts
	await prisma.blogPost.deleteMany()
	for (const post of DEFAULT_POSTS) {
		await prisma.blogPost.create({ data: post })
	}
	console.log('✅ Blog posts seeded')

	console.log('')
	console.log('🎉 Seeding complete!')
	console.log('   Login: admin@portfolio.com')
	console.log('   Password: admin123')
}

main()
	.then(() => prisma.$disconnect())
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
