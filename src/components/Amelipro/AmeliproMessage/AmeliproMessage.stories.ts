import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMessage from './AmeliproMessage.vue'

const meta = {
	argTypes: {
		'alignStart': { description: 'Aligne le texte et l’icône en haut' },
		'borderLeftMessage': { description: 'Applique un nouveau style au message avec un fond gris et une bordure à gauche du bloc lorsque cette property est active il ne faut pas utiliser le slot par défaut mais un slot dédié pour le contenu du message' },
		'borderLeftMessageContent': { description: 'Slot pour le contenu du message si la property `BorderLeftMessage` est active.' },
		'borderLeftMessageTitle': { description: 'Titre du Message pour le cas où la property BorderLeftMessage est active' },
		'click:close': { description: 'Événement émis lorsque l’utilisateur clique sur le bouton fermer.', type: 'void' },
		'color': { description: 'Couleur personnalisée du message' },
		'dark': { description: 'Change le style tu texte et de l’icône du blanc vers le noir' },
		'default': { description: 'Slot pour le contenu du message.' },
		'dismissible': { description: 'Possibilité de fermer le message' },
		'icon': { description: 'Icône personnalisée' },
		'iconBgColor': { description: 'Couleur personnalisée pour le fond de l’icône du message' },
		'iconColor': { description: 'Couleur personnalisée pour l’icône du message' },
		'maxWidth': { description: 'Largeur maximale du message' },
		'noIcon': { description: 'Retirer l’icône du message' },
		'text': { description: 'change le type d’affichage du message qui n’aura plus de fond coloré' },
		'textColor': { description: 'Couleur personnalisée du texte du message lorsque la property `text` est à true' },
		'type': {
			control: 'select',
			description: 'type de message parmi ces choix : `error`, `warning`, `info` et `advice`',
			options: ['info', 'error', 'warning', 'success'],
		},
		'uniqueId': { description: 'Identifiant unique du message' },
		'value': { description: 'Valeur d’affichage ou non du message' },
		'width': { description: 'Largeur du message' },
	},
	component: AmeliproMessage,
	title: 'Composants/Amelipro/AmeliproMessage',
} as Meta<typeof AmeliproMessage>
export default meta

type Story = StoryObj<typeof AmeliproMessage>

export const Default: Story = {
	args: { uniqueId: 'amelipro-message-unique-id' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMessage
		unique-id="amelipro-message-unique-id"
		>
		<p class="mb-0">
			Exemple de Message
		</p>
	</AmeliproMessage>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproMessage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMessage },
		setup() {
			return { args }
		},
		template: `
<AmeliproMessage
	v-bind="args"
	>
	<p class="mb-0">
		Exemple de Message
	</p>
</AmeliproMessage>`,
	}),
}

export const BorderLeft: Story = {
	args: {
		borderLeftMessage: true,
		borderLeftMessageTitle: 'Le titre du message',
		uniqueId: 'amelipro-message-unique-id-2',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMessage
		border-left-message
		border-left-message-title="Le titre du message"
		unique-id="amelipro-message-unique-id-2"
	>
		<template #borderLeftMessageContent>
			<p class="ap-grey--text text--darken-1 mb-0">
				Le contenu de mon message
			</p>
		</template>
	</AmeliproMessage>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproMessage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMessage },
		setup() {
			return { args }
		},
		template: `
<AmeliproMessage
	v-bind="args"
>
	<template #borderLeftMessageContent>
		<p class="text-ap-grey-darken-1 mb-0">
			Le contenu de mon message
		</p>
	</template>
</AmeliproMessage>`,
	}),
}
