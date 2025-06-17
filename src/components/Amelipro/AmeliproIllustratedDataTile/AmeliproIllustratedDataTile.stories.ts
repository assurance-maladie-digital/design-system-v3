import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproIllustratedDataTile from './AmeliproIllustratedDataTile.vue'

const meta = {
	argTypes: {
		complementaryInformation: { description: 'Informations supplémentaires après le sous-titre' },
		iconName: { description: 'Nom de l’icône pour illustrer la data' },
		imgSrc: { description: 'Chemin vers une image.' },
		labelFirstLine: { description: 'Première ligne de texte de la tuile' },
		labelSecondLine: { description: 'Deuxième ligne de texte de la tuile' },
		tileInfoColor: { description: 'Couleur de l’icône, et des deux lignes de label' },
		tileMinHeight: { description: 'Hauteur minimale du bouton/lien.' },
		tilePadding: { description: 'Padding sur la tuile' },
		tileWidth: { description: 'Largeur de la tuile' },
		titleLevel: { description: 'Niveau de titre de la tuile' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproIllustratedDataTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproIllustratedDataTile',
} as Meta<typeof AmeliproIllustratedDataTile>
export default meta

type Story = StoryObj<typeof AmeliproIllustratedDataTile>

export const Default: Story = {
	args: {
		iconName: 'chrono',
		labelFirstLine: 'Label 1',
		labelSecondLine: 'Label 2',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-data-tile-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIllustratedDataTile
		icon-name="chrono"
		label-first-line="Label 1"
		label-second-line="Label 2"
		tile-width="250px"
		unique-id="amelipro-illustrated-data-tile-unique-id"
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
<AmeliproIllustratedDataTile
	v-bind="args"
/>
		`,
	}),

}
