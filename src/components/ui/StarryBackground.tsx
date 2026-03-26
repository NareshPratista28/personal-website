'use client'

import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function StarryBackground() {
	const [init, setInit] = useState(false)

	useEffect(() => {
		initParticlesEngine(async engine => {
			await loadSlim(engine)
		}).then(() => {
			setInit(true)
		})
	}, [])

	if (!init) return <div className="absolute inset-0 bg-black -z-10" />

	return (
		<div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
			<Particles
				id="tsparticles"
				className="absolute inset-0 w-full h-full"
				options={{
					fullScreen: { enable: false, zIndex: 0 },
					background: {
						color: { value: 'transparent' },
					},
					fpsLimit: 144,
					particles: {
						color: { value: '#b8bcc6' },
						number: {
							value: 180,
							density: { enable: true, width: 800 },
						},
						opacity: {
							value: { min: 0.2, max: 0.8 },
							animation: { enable: true, speed: 0.8, sync: false },
						},
						size: {
							value: { min: 0.8, max: 2.4 },
						},
						move: {
							enable: true,
							speed: 0.5,
							direction: 'none',
							random: true,
							outModes: { default: 'out' },
						},
						links: { enable: false },
					},
					detectRetina: true,
				}}
			/>
		</div>
	)
}
