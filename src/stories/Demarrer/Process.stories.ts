import type { StoryObj } from '@storybook/vue3-vite'
import '../styles/shared.css'

export default {
	title: 'Démarrer/Process',
}

export const Schema: StoryObj = {
	render: () => ({
		template: `
			<img
				src="/process-traitement-tickets.png"
				alt="Schéma du traitement d'un ticket, décrit étape par étape dans la liste ci-dessus."
				width="749"
				height="1304"
				style="display: block; max-width: 100%; height: auto; margin-top: 16px;"
			/>
		`,
	}),
	tags: ['!dev'],
}
