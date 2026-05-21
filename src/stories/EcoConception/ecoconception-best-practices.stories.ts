import type { Meta, StoryObj } from '@storybook/vue3'
import EcoBestPracticesDoc from './EcoBestPracticesDoc.vue'

export default {
	title: 'Éco-conception/Bonnes pratiques essentielles',
	component: EcoBestPracticesDoc,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Documentation Storybook inspirée de la synthèse PDF avec navigation par catégories, filtres, tableaux, moyens de contrôle et impacts.',
			},
		},
	},
	tags: ['!autodocs'],
} as Meta<typeof EcoBestPracticesDoc>

export const BonnesPratiques: StoryObj<typeof EcoBestPracticesDoc> = {
	render: () => ({
		components: {
			EcoBestPracticesDoc,
		},
		template: '<EcoBestPracticesDoc />',
	}),
	parameters: {
		layout: 'fullscreen',
	},
}
