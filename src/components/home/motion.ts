export const sectionMotion = {
	initial: { opacity: 0, y: 40 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.2 },
	transition: { duration: 0.65, ease: 'easeOut' as const },
}

export const cardMotion = {
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	whileHover: { y: -8 },
	viewport: { once: true, amount: 0.3 },
	transition: { duration: 0.45 },
}
