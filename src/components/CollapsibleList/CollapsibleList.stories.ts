import type { Meta, StoryObj } from '@storybook/vue3'

import CollapsibleList from './CollapsibleList.vue'

const meta = {
	title: 'Components/CollapsibleList',
	component: CollapsibleList,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		listTitle: {
			control: 'text',
		},
		items: {
			control: 'object',
		},
	},
} as Meta<typeof CollapsibleList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		listTitle: 'Santé',
		items: [
			{
				text: 'Mon espace santé',
				href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
			},
			{
				text: 'Accomplir les bons gestes',
				href: 'https://www.ameli.fr/assure/sante/bons-gestes',
			},
		],
	},
	render: (args) => {
		return {
			components: { CollapsibleList },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<CollapsibleList v-bind="args" />
				</div>
			`,
		}
	},
}
