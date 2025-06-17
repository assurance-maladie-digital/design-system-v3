import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproStatus from './AmeliproStatus.vue'

const meta = {
	argTypes: {
		isSpan: { description: 'Change la balise qui entoure le statut en balise span' },
		label: { description: 'Change le texte du statut' },
		paddingX: { description: 'Padding à gauche et à droite du statut' },
		paddingY: { description: 'Padding en haut et en bas du statut' },
		type: {
			control: 'select',
			description: 'Type de statut parmi ces choix : `success`, `failure`, `action`, `progress`, `closed`, `draft`, `archive` et `canceled`',
			options: ['action', 'archive', 'canceled', 'closed', 'draft', 'failure', 'progress', 'success'],
			table: { type: { summary: 'string' } },
		},
		uniqueId: { description: 'Identifiant unique du statut' },
	},
	component: AmeliproStatus,
	title: 'Composants/Amelipro/AmeliproStatus',
} as Meta<typeof AmeliproStatus>
export default meta

type Story = StoryObj<typeof AmeliproStatus>

export const Default: Story = {
	args: { type: 'draft' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproStatus
		type="draft"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() {
			return { args }
		},
		template: `
<AmeliproStatus
	v-bind="args"
/>
		`,
	}),
}
