import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproTransmission from './AmeliproTransmission.vue'

const meta = {
	argTypes: {
		'actions': { description: 'Pour remplacer les boutons inclus par défaut dans le composant`' },
		'alternateButtonLabel': { description: 'Label du bouton alternatif' },
		'click:confirm': { description: 'Événement émis au clic sur le bouton confirmer', type: 'void' },
		'click:modify': { description: 'Événement émis au clic sur le bouton modifier', type: 'void' },
		'click:print': { description: 'Événement émis au clic sur le bouton imprimer', type: 'void' },
		'confirmButtonLabel': { description: 'Label du bouton de confirmation' },
		'confirmHref': { description: 'Url du bouton confirmer' },
		'confirmTo': { description: 'Route du bouton confirmer' },
		'default': { description: 'Slot par défaut qui permet de mettre du contenu dans le composant' },
		'modifyHref': { description: 'Url du bouton modifier' },
		'modifyTo': { description: 'Route du bouton modifier' },
		'printHref': { description: 'Url du bouton imprimer' },
		'printTo': { description: 'Route du bouton imprimer' },
		'transmissionActions': { description: 'Activation des boutons d’actions se désactive automatiquement si on rempli le slot actions' },
		'transmissionCardTitle': { description: 'Titre de la card' },
		'uniqueId': { description: 'Identifiant unique du composant' },
	},
	component: AmeliproTransmission,
	title: 'Composants/Amelipro/Cartes/AmeliproTransmission',
} as Meta<typeof AmeliproTransmission>
export default meta

type Story = StoryObj<typeof AmeliproTransmission>

export const Default: Story = {
	args: { transmissionCardTitle: 'Titre de la carte' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTransmission
		transmission-card-title="Titre de la carte"
	>
		Contenu principal
	</AmeliproTransmission>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() {
			return { args }
		},
		template: `
<AmeliproTransmission
	v-bind="args"
>
	Contenu principal
</AmeliproTransmission>
		`,
	}),

}
