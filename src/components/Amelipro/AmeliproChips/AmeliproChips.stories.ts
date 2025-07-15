import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproChips from './AmeliproChips.vue'

const meta = {
	argTypes: {
		click: {
			action: 'click',
			description: 'Événement émis au click sur le bouton croix. Retourne `uniqueId`',
			type: 'string',
		},
		text: { description: 'Partie textuelle du composant' },
		uniqueId: { description: 'Identifiant unique' },
	},
	component: AmeliproChips,
	title: 'Composants/Amelipro/AmeliproChips',
} as Meta<typeof AmeliproChips>
export default meta

type Story = StoryObj<typeof AmeliproChips>

export const Default: Story = {
	args: {
		text: 'Texte à afficher',
		uniqueId: 'amelipro-chips-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproChips
		v-model="model"
		text="Texte à afficher"
		unique-id="amelipro-chips-unique-id"
		@click="args['click']"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproChips },
		setup() {
			return { args }
		},
		template: `
<AmeliproChips
	v-bind="args"
	@click="args['click']"
/>
		`,
	}),

}
