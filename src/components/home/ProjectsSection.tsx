'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, GitBranch, X, ExternalLink } from 'lucide-react'
import { cardMotion, sectionMotion } from '@/components/home/motion'
import Image from 'next/image'

type Project = {
	id: string
	title: string
	category: string
	description: string
	imageUrl: string | null
	demoUrl: string | null
	githubUrl: string | null
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
	const categories = ['All', ...new Set(projects.map(p => p.category))]
	const [activeTab, setActiveTab] = useState('All')
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)

	const filtered = useMemo(
		() => (activeTab === 'All' ? projects : projects.filter(p => p.category === activeTab)),
		[activeTab, projects],
	)

	return (
		<>
			<motion.section
				id="projects"
				className="relative w-full py-24 lg:py-32 bg-black border-t border-white/10"
				{...sectionMotion}
			>
				<div className="container mx-auto px-6 md:px-12">
					<div className="mb-16">
						<div className="flex items-center gap-4 mb-4">
							<span className="w-10 h-0.5 bg-white"></span>
							<span className="text-sm font-semibold tracking-widest uppercase text-gray-400">
								Recent Projects
							</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-white">My Work Example</h2>
					</div>

					<div className="flex flex-wrap gap-6 border-b border-white/10 mb-12 pb-4">
						{categories.map(tab => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={`text-sm md:text-base font-semibold tracking-wide transition-all duration-300 relative ${
									activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
								}`}
							>
								{tab}
								{activeTab === tab && (
									<span className="absolute -bottom-4.25 left-0 w-full h-0.5 bg-white"></span>
								)}
							</button>
						))}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filtered.map(project => (
							<motion.article
								key={project.id}
								onClick={() => setSelectedProject(project)}
								className="group cursor-pointer bg-zinc-900 border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col hover:shadow-2xl hover:shadow-white/5"
								{...cardMotion}
							>
								<div className="w-full h-56 bg-zinc-800 overflow-hidden relative border-b border-white/10">
									{project.imageUrl ? (
										<Image
											src={project.imageUrl}
											alt={project.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700">
											<GitBranch size={48} className="text-zinc-500" />
										</div>
									)}
								</div>

								<div className="p-6 md:p-8 flex flex-col grow">
									<p className="text-zinc-500 text-xs font-bold mb-3 uppercase tracking-widest">
										{project.category}
									</p>
									<h3 className="text-white text-2xl font-bold mb-4 line-clamp-1 group-hover:text-zinc-300 transition-colors">
										{project.title}
									</h3>
									<p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed grow">
										{project.description}
									</p>

									<div className="mt-8 flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-zinc-300 transition-colors relative w-fit after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300">
										View Details
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</motion.article>
						))}
					</div>

					{filtered.length === 0 && (
						<p className="text-center text-zinc-600 py-16 font-medium">No projects found.</p>
					)}
				</div>
			</motion.section>

			{/* Modal Popup */}
			{selectedProject && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
					<div 
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
						onClick={() => setSelectedProject(null)}
					/>
					
					<motion.div 
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
					>
						{/* Close button */}
						<button 
							onClick={() => setSelectedProject(null)}
							className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
						>
							<X className="w-5 h-5" />
						</button>

						<div className="overflow-y-auto w-full custom-scrollbar">
							{/* Large Cover Image */}
							<div className="w-full h-64 sm:h-80 md:h-96 relative bg-zinc-900 border-b border-white/10 shrink-0">
								{selectedProject.imageUrl ? (
									<Image
										src={selectedProject.imageUrl}
										alt={selectedProject.title}
										fill
										priority
										className="object-cover"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center opacity-30">
										<GitBranch size={64} className="text-zinc-500" />
									</div>
								)}
							</div>
							
							{/* Modal Content */}
							<div className="p-6 md:p-10 lg:p-12">
								<div className="flex items-center gap-3 mb-6">
									<span className="px-3 py-1 bg-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full">
										{selectedProject.category}
									</span>
								</div>
								
								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
									{selectedProject.title}
								</h2>
								
								<p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-12 whitespace-pre-wrap">
									{selectedProject.description}
								</p>
								
								{/* Actions */}
								<div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
									{selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
										<Link
											href={selectedProject.demoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 bg-white text-black text-center font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group"
										>
											Visit Live Demo
											<ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
										</Link>
									)}
									
									{selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
										<Link
											href={selectedProject.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 bg-zinc-900 text-white border border-white/20 text-center font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group"
										>
											<GitBranch className="w-4 h-4" />
											Source Code
										</Link>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</>
	)
}
