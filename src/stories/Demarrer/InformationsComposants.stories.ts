import type { StoryObj } from '@storybook/vue3-vite'
import ComponentTrackingPage from './SuiviDesComposants/ComponentTrackingPage.vue'

export default {
	title: 'Démarrer/Suivi des composants',
}

export const ComponentTracking: StoryObj = {
	render: () => ({
		components: { ComponentTrackingPage },
		template: '<ComponentTrackingPage />',
	}),
	tags: ['!dev'],
}
