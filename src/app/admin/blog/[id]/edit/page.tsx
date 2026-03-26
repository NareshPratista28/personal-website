import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'

export default async function EditBlogPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const post = await prisma.blogPost.findUnique({ where: { id } })
	if (!post) notFound()

	return (
		<BlogForm
			initial={{
				id: post.id,
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt,
				content: post.content,
				coverImageUrl: post.coverImageUrl ?? '',
				status: post.status,
			}}
		/>
	)
}
