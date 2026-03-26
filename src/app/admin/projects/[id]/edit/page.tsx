import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'

export default async function EditProjectPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const project = await prisma.project.findUnique({ where: { id } })
	if (!project) notFound()

	return (
		<ProjectForm
			initial={{
				id: project.id,
				title: project.title,
				category: project.category,
				description: project.description,
				imageUrl: project.imageUrl ?? '',
				demoUrl: project.demoUrl ?? '',
				githubUrl: project.githubUrl ?? '',
				status: project.status,
				order: project.order,
			}}
		/>
	)
}
