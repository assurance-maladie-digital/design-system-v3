import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproBadge from './AmeliproBadge.vue'

const meta = {
	argTypes: {
		badgeColor: { description: 'Défini la couleur du badge' },
		badgeContent: { description: 'Texte à l’intérieur du badge' },
		badgeTextColor: { description: 'Défini la couleur du text du badge' },
		isSpan: { description: 'Gère le type de balise HTML du composant, `p` ou `span`' },
		roundedRight: { description: 'Active l’apparence label avec un border radius a droite' },
		uniqueId: { description: 'Identifiant unique du badge' },
	},
	component: AmeliproBadge,
	title: 'Composants/Amelipro/AmeliproBadge',
} as Meta<typeof AmeliproBadge>
export default meta

type Story = StoryObj<typeof AmeliproBadge>

export const Default: Story = {
	args: { badgeContent: 'Contenu du badge' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBadge
		badge-content="Contenu du badge"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproBadge } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBadge },
		setup() {
			return { args }
		},
		template: `
			<AmeliproBadge
				v-bind="args"
			/>
		`,
	}),

}
