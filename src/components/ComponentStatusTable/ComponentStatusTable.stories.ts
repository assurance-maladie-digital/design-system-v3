import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ComponentStatusTable from './ComponentStatusTable.vue'

export default {
	title: 'Composants',
} as Meta

export const Default: StoryObj = {
	render: () => ({
		components: {
			ComponentStatusTable,
		},
		template: '<ComponentStatusTable />',
	}),
	parameters: {
		docs: {
			description: {
				story: ' ',
			},
		},
	},
}
