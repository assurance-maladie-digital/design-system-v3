import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproDisclosure from './AmeliproDisclosure.vue'

const meta = {
	argTypes: {
		default: { description: 'Contenu du panneau dépliant' },
		isOpen: { description: 'Défini si le panneau dépliant est ouvert au chargement du composant' },
		title: { description: 'Titre du panneau dépliant' },
		uniqueId: { description: 'Identifiant unique du panneau dépliant' },
	},
	component: AmeliproDisclosure,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproDisclosure',
} as Meta<typeof AmeliproDisclosure>

export default meta

type Story = StoryObj<typeof AmeliproDisclosure>

export const Default: Story = {
	args: {
		default: '[Slot: default]',
		title: 'Mon titre',
		uniqueId: 'amelipro-disclosure-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproDisclosure
		title="Mon titre"
		unique-id="amelipro-disclosure-unique-id"
	>
		[Slot: default]
	</AmeliproDisclosure>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDisclosure },
		setup() {
			return { args }
		},
		template: `
<AmeliproDisclosure
	v-bind="args"
>
	{{ args.default }}
</AmeliproDisclosure>`,
	}),
}
