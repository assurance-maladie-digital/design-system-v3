import type { StoryObj } from '@storybook/vue3-vite'
import ComponentTrackingPage from './SuiviDesComposants/ComponentTrackingPage.vue'

export default {
	title: 'Démarrer/Suivi des composants',
	tags: ['!manifest'],
}

export const ComponentTracking: StoryObj = {
	render: () => ({
		components: { ComponentTrackingPage },
		template: '<ComponentTrackingPage />',
	}),
	tags: ['!dev', '!manifest'],
}
