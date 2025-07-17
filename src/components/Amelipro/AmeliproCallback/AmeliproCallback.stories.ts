import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCallback from './AmeliproCallback.vue'

const meta = {
	argTypes: {
		'cardActions': { description: 'Permet de modifier la zone prévu pour les boutons cardActions' },
		'cardTitle': { description: 'Titre de la carte' },
		'click:transmission': {
			action: 'click:transmission',
			description: 'Événement émis au clic sur le bouton "Réessayer".',
			type: 'void',
		},
		'contentBottom': { description: 'Permet de rajouter du contenu sous le contenu principal de la carte' },
		'contentText': { description: 'Text de la carte (contenu)' },
		'contentTitle': { description: 'Titre du contenu' },
		'contentTitleColor': { description: 'Permet de définir la couleur du titre du contenu' },
		'defaultContent': { description: 'Permet de modifier le contenu central par défaut à l’intérieur de la card' },
		'failure': { description: 'Affiche un icône en forme de croix pour signifier un échec de transmission' },
		'imgMinWidth': { description: 'Permet de définir la taille minimale de l’image' },
		'imgUrl': { description: 'Url permettant l’affichage d’une image en remplacement des icônes par défaut' },
		'imgWidth': { description: 'Permet de définir la taille de l’image' },
		'retryBtn': { description: 'Affiche le bouton réessayer' },
		'text': { description: 'Permet de modifier la zone de texte par défaut à l’intérieur de la card si le slot defaultContent n’est pas renseigné' },
		'transmissionHref': { description: 'Url du bouton réessayer' },
		'transmissionTo': { description: 'Route du bouton réessayer' },
		'uniqueId': { description: 'Identifiant unique du composant' },
	},
	component: AmeliproCallback,
	title: 'Composants/Amelipro/Cartes/AmeliproCallback',
} as Meta<typeof AmeliproCallback>
export default meta

type Story = StoryObj<typeof AmeliproCallback>

export const Default: Story = {
	args: {
		cardTitle: 'Titre de la carte',
		contentText: 'Texte du contenu',
		contentTitle: 'Titre du contenu',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCallback 
		card-title="Titre de la carte"
		content-text="Texte du contenu"
		content-title="Titre du contenu"
		@click:transmission="onTransmission"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() {
			return { args }
		},
		template: `
<AmeliproCallback
	v-bind="args"
	@click:transmission="args['click:transmission']"
/>
		`,
	}),
}
