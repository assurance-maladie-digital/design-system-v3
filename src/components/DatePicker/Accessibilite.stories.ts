import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'
const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/DatePicker/Accessibility',
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `   
            `,
		}
	},
	tags: ['!dev'],
}
