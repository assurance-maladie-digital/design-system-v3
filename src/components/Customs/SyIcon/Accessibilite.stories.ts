import SyIconAccessibility from './SyIconAccessibility.vue'
import { mdiStar } from '@mdi/js'

const meta = {
	title: 'Composants/Données/SyIcon/Accessibilite',
	component: () => import('./SyIcon.vue'),
	parameters: {
		docs: {
			description: {
				component: 'Icon component for accessibility features.',
			},
		},
	},
}

export default meta

export const AccessibilityDemo = {
	args: {
		icon: mdiStar, // Using an icon from the imported icons
	},
	render: () => ({
		components: { SyIconAccessibility },
		template: '<SyIconAccessibility />',
	}),
	tags: ['!dev'],
}
