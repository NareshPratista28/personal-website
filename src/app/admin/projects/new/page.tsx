import ProjectForm from '@/components/admin/ProjectForm'
import { prisma } from '@/lib/db'

export default async function NewProjectPage() {
	const settings = await prisma.siteSettings.findUnique({ where: { key: 'project_categories' } })
	let categories: string[] = ["Web App", "Mobile App", "UI/UX Design"]
	try {
		if (settings?.value) categories = JSON.parse(settings.value)
	} catch {}

	return <ProjectForm predefinedCategories={categories} />
}
