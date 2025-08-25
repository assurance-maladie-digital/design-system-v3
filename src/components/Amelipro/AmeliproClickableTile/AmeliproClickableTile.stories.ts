import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproClickableTile from './AmeliproClickableTile.vue'

const meta = {
	argTypes: {
		borderedIcon: { description: 'change le style du pictogramme à gauche de la tuile' },
		click: {
			table: { category: 'events' },
			description: 'Événement émis au click sur le bouton',
		},
		default: { description: 'slot permettant de remplacer la property `tileTitle`, ce slot ne doit contenir que des balises span' },
		disabled: { description: 'désactive la tuile' },
		href: { description: 'Url de destination du lien' },
		icon: { description: 'Nom de l\'icone à afficher' },
		imgMaxWidth: { description: 'Taille maximale de l’image du bouton' },
		imgMinWidth: { description: 'Taille minimale de l’image du bouton' },
		imgSrc: { description: 'Url de l’image du bouton' },
		imgWidth: { description: 'Taille de l’image du bouton' },
		tileTitle: { description: 'Texte à afficher sur la tuile' },
		tileWidth: { description: 'La largeur du bouton/lien' },
		to: { description: 'Route de destination du lien' },
		uniqueId: { description: 'Ajoute un id au bouton' },
	},
	component: AmeliproClickableTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproClickableTile',
} as Meta<typeof AmeliproClickableTile>

export default meta

type Story = StoryObj<typeof AmeliproClickableTile>

export const Default: Story = {
	args: {
		icon: 'utilisateur',
		tileTitle: 'Titre de la tuile',
		uniqueId: 'amelipro-tile-btn-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
	<AmeliproClickableTile
		icon="utilisateur"
		tile-title="Titre de la tuile"
		unique-id="amelipro-tile-btn-unique-id"
	/>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproClickableTile } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
	<AmeliproClickableTile
		v-bind="args"
	/>`,
	}),
}
