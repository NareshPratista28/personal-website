'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Quote,
	Heading2,
	Heading3,
	Undo,
	Redo,
	Code,
} from 'lucide-react'

export default function RichTextEditor({
	content,
	onChange,
}: {
	content: string
	onChange: (html: string) => void
}) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({ placeholder: 'Start writing your post...' }),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		editorProps: {
			attributes: {
				class:
					'min-h-[300px] p-4 text-sm text-zinc-300 leading-relaxed outline-none prose prose-invert max-w-none',
			},
		},
	})

	if (!editor) return null

	const tools = [
		{
			icon: Bold,
			action: () => editor.chain().focus().toggleBold().run(),
			active: editor.isActive('bold'),
			title: 'Bold',
		},
		{
			icon: Italic,
			action: () => editor.chain().focus().toggleItalic().run(),
			active: editor.isActive('italic'),
			title: 'Italic',
		},
		{
			icon: Code,
			action: () => editor.chain().focus().toggleCode().run(),
			active: editor.isActive('code'),
			title: 'Inline code',
		},
		{
			icon: Heading2,
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			active: editor.isActive('heading', { level: 2 }),
			title: 'Heading 2',
		},
		{
			icon: Heading3,
			action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			active: editor.isActive('heading', { level: 3 }),
			title: 'Heading 3',
		},
		{
			icon: List,
			action: () => editor.chain().focus().toggleBulletList().run(),
			active: editor.isActive('bulletList'),
			title: 'Bullet list',
		},
		{
			icon: ListOrdered,
			action: () => editor.chain().focus().toggleOrderedList().run(),
			active: editor.isActive('orderedList'),
			title: 'Ordered list',
		},
		{
			icon: Quote,
			action: () => editor.chain().focus().toggleBlockquote().run(),
			active: editor.isActive('blockquote'),
			title: 'Quote',
		},
		{
			icon: Undo,
			action: () => editor.chain().focus().undo().run(),
			active: false,
			title: 'Undo',
		},
		{
			icon: Redo,
			action: () => editor.chain().focus().redo().run(),
			active: false,
			title: 'Redo',
		},
	]

	return (
		<div className="w-full bg-zinc-900 border border-white/10 rounded-lg overflow-hidden focus-within:border-white/40 transition-colors">
			<div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-white/10">
				{tools.map(({ icon: Icon, action, active, title }) => (
					<button
						key={title}
						type="button"
						title={title}
						onClick={action}
						className={`p-1.5 rounded transition-colors ${
							active
								? 'bg-white/20 text-white'
								: 'text-zinc-500 hover:text-white hover:bg-white/10'
						}`}
					>
						<Icon className="w-3.5 h-3.5" />
					</button>
				))}
			</div>
			<EditorContent editor={editor} />
		</div>
	)
}
