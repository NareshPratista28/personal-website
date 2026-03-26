import { prisma } from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import BlogsSection from '@/components/home/BlogsSection'
import ContactSection from '@/components/home/ContactSection'
import SiteFooter from '@/components/home/SiteFooter'

async function getSettings() {
	const rows = await prisma.siteSettings.findMany()
	return Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]))
}

export default async function Home() {
	const [settings, projects, posts] = await Promise.all([
		getSettings(),
		prisma.project.findMany({
			where: { status: 'PUBLISHED' },
			orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
		}),
		prisma.blogPost.findMany({
			where: { status: 'PUBLISHED' },
			orderBy: { publishedAt: 'desc' },
			take: 3,
			select: {
				id: true,
				title: true,
				slug: true,
				excerpt: true,
				coverImageUrl: true,
				publishedAt: true,
				createdAt: true,
				status: true,
			},
		}),
	])

	let techStack: string[] = []
	try {
		techStack = JSON.parse(settings.techStack || '[]')
	} catch {
		techStack = []
	}

	return (
		<main className="bg-black min-h-screen w-full">
			<HeroSection
				name={settings.heroName ?? 'YOUR NAME'}
				tagline={settings.heroTagline ?? 'Software Engineer'}
				bio={settings.heroBio ?? ''}
				techStack={techStack}
				githubUrl={settings.githubUrl ?? '#'}
				linkedinUrl={settings.linkedinUrl ?? '#'}
				email={settings.email ?? '#'}
			/>
			<AboutSection
				name={settings.aboutName ?? ''}
				role={settings.aboutRole ?? ''}
				bio={settings.aboutBio ?? ''}
				image={settings.aboutImage ?? '/image.png'}
				cvUrl={settings.cvUrl ?? '#'}
				hireMeEmail={settings.email ?? '#'}
			/>
			<ProjectsSection projects={projects} />
			<BlogsSection posts={posts} />
			<ContactSection
				email={settings.email ?? ''}
				location={settings.location ?? ''}
			/>
			<SiteFooter />
		</main>
	)
}
