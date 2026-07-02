import type { Meta, StoryObj } from '@storybook/vue3-vite'
import EcoBestPracticesDoc from './EcoBestPracticesDoc.vue'

export default {
	title: 'Éco-conception',
	component: EcoBestPracticesDoc,
} as Meta

export const BonnesPratiquesEssentielles: StoryObj = {
	render: () => ({
		components: {
			EcoBestPracticesDoc,
		},
		template: '<EcoBestPracticesDoc />',
	}),
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['!dev'],
}
