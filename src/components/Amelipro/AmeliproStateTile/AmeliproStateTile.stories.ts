import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproStateTile from './AmeliproStateTile.vue'

const meta = {
	argTypes: {
		btnStyledText: { description: 'Partie du texte qui s’affiche dans la tuile sous forme de bouton' },
		click: { description: 'Événement émis au click sur les tuiles cliquables. Retourne `uniqueId`', type: 'string | undefined' },
		contentMinHeight: { description: 'Hauteur minimale du contenu de la tuile' },
		disabled: { description: 'Pour désactiver la tuile' },
		href: { description: 'Url de destination du lien.' },
		labelFirstLine: { description: 'Première ligne de texte de la tuile' },
		labelSecondLine: { description: 'Deuxième ligne de texte de la tuile' },
		labelThirdLine: { description: 'Troisième ligne de texte de la tuile' },
		noPdfIcon: { description: 'Pour masquer l’icône "PDF"' },
		tileMinHeight: { description: 'La hauteur minimale du bouton/lien.' },
		tilePaddingX: { description: 'Padding sur les côtés de la tuile.' },
		tileType: {
			description: 'Type de la tuile parmi : `date`, `toDo`, `toDoNoCertificate`, `toDoNoCertificateBlue`, `optionnal`, `done`, `doneNoCertificate` et `doneNoCertificateBlue`.',
			options: [
				'date',
				'toDo',
				'toDoNoCertificate',
				'toDoNoCertificateBlue',
				'optionnal',
				'done',
				'doneNoCertificate',
				'doneNoCertificateBlue',
			],
		},
		tileWidth: { description: 'La largeur de la tuile.' },
		to: { description: 'Route de destination du lien.' },
		uniqueId: { description: 'Ajoute un id au bouton' },
	},
	component: AmeliproStateTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproStateTile',
} as Meta<typeof AmeliproStateTile>
export default meta

type Story = StoryObj<typeof AmeliproStateTile>

export const Default: Story = {
	args: {
		btnStyledText: 'Réaliser cet examen',
		labelFirstLine: 'Au cours de',
		labelSecondLine: 'Xème période',
		tileMinHeight: '100%',
		tileType: 'toDoNoCertificate',
		tileWidth: '300px',
		uniqueId: 'amelipro-state-tile-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproStateTile
		btn-styled-text="Réaliser cet examen"
		label-first-line="Au cours de"
		label-second-line="Xème période"
		tile-min-height="100%"
		tile-type="toDoNoCertificate"
		tile-width="300px"
		unique-id="amelipro-state-tile-unique-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproStateTile } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() {
			return { args }
		},
		template: `
<AmeliproStateTile
	v-bind="args"
/>`,
	}),
}
