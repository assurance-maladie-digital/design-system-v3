import type { Meta, StoryObj } from '@storybook/vue3'
import EcoGuideComponent from './EcoGuideComponent.vue'

/**
 * Page moderne pour l'éco-conception utilisant les composants Vuetify
 */
export default {
	title: 'Éco-conception',
} as Meta

/**
 * Histoire principale avec une interface moderne et interactive pour explorer les règles d'éco-conception
 */

export const Referentiel: StoryObj = {
	render: () => ({
		components: {
			EcoGuideComponent,
		},
		template: '<EcoGuideComponent />',
	}),
	parameters: {
		docs: {
			description: {
				story: 'Une interface moderne et interactive pour explorer les règles d\'éco-conception, avec présentation en vue cartes.',
			},
		},
	},
	tags: ['!dev'],
}
