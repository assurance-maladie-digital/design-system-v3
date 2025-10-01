import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproChips from './AmeliproChips.vue'

const meta = {
	argTypes: {
		click: { description: 'Événement émis au click sur le bouton croix. Retourne `uniqueId`', type: 'string' },
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
		text="Texte à afficher"
		unique-id="amelipro-chips-unique-id"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproChips } from '@cnamts/synapse'
</script>`,
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
/>
		`,
	}),
}

export const AvecGestionClick: Story = {
	name: 'Avec gestion du click',
	args: {
		text: 'Cliquer pour fermer',
		uniqueId: 'amelipro-chips-click',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproChips
        text="Cliquer pour fermer"
        unique-id="amelipro-chips-click"
        @click="onChipClick"
    />
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproChips } from '@cnamts/synapse'

function onChipClick(id: string) {
    alert('Clic intercepté sur la puce avec l’id : ' + id)
}
</script>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproChips },
		setup() {
			function onChipClick(id: string) {
				alert('Clic intercepté sur la puce avec l’id : ' + id)
			}
			return { args, onChipClick }
		},
		template: `
<p class="mb-2">Puce avec gestion de l’événement <code>click</code> (affiche un <code>alert</code>).</p>
<AmeliproChips v-bind="args" @click="onChipClick" />
        `,
	}),
}
