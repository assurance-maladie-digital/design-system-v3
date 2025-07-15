import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproMessagingLayout from './AmeliproMessagingLayout.vue'
import type { MessagingMenuTypes } from './types'

const meta = {
	argTypes: {
		'click-new-message': {
			action: 'click-new-message',
			description: 'Pour gérer un affichage spécifique à une carte',
			type: 'void',
		},
		'items': {
			description: 'Liste des lien composants le menu de la messagerie, la propriété active symbolisant la page active',
			table: {
				type: {
					detail: `Array<{
	active?: boolean;
	href?: string;
	icon: string;
	label: string;
	to?: RouteLocationRaw;
	unreadNumber?: number;
}>`,
					summary: 'MessagingMenuTypes[]',
				},
			},
		},
		'mainContentBg': { description: 'Background du conteneur principal de la messagerie' },
		'menuWidth': { description: 'Largeur du menu de la messagerie' },
		'newMessageDisable': { description: 'Désactive le bouton nouveau message' },
		'uniqueId': { description: 'Identifiant unique du composant' },
	},
	component: AmeliproMessagingLayout,
	title: 'Composants/Amelipro/Mise en page/AmeliproMessagingLayout',
} as Meta<typeof AmeliproMessagingLayout>

export default meta

type Story = StoryObj<typeof meta>

const items: MessagingMenuTypes[] = [
	{
		href: '#',
		icon: 'discussion',
		label: 'À traiter',
		unreadNumber: 1,
	},
	{
		active: true,
		href: '#',
		icon: 'horlogeFlecheDroiteNoCircle',
		label: 'En cours',
	},
	{
		href: '#',
		icon: 'ecrire',
		label: 'Brouillons',
		unreadNumber: 1,
	},
	{
		href: '#',
		icon: 'boite',
		label: 'Clos',
		unreadNumber: 1,
	},
]

export const Default: Story = {
	args: {
		items,
		uniqueId: 'amelipro-messaging-layout-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMessagingLayout
		:items="items"
		unique-id="amelipro-messaging-layout-unique-id"
		@click:new-message="args['click:new-message']"
	>
		<div class="pa-4">
			<AmeliproCard
				card-title="Titre de la carte"
				unique-id="card-id-exemple"
			>
				<p class="mb-0">
					Exemple de contenu principal
				</p>
			</AmeliproCard>
		</div>
	</AmeliproMessagingLayout>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproCard, AmeliproMessagingLayout } from '@cnamts/synapse'

	const items = [
		{
			href: '#',
			icon: 'discussion',
			label: 'À traiter',
			unreadNumber: 1,
		},
		{
			active: true,
			href: '#',
			icon: 'horlogeFlecheDroiteNoCircle',
			label: 'En cours',
		},
		{
			href: '#',
			icon: 'ecrire',
			label: 'Brouillons',
			unreadNumber: 1,
		},
		{
			href: '#',
			icon: 'boite',
			label: 'Clos',
			unreadNumber: 1,
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMessagingLayout, AmeliproCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproMessagingLayout
	v-bind="args"
	@click:new-message="args['click:new-message']"
>
	<div class="pa-4">
		<AmeliproCard
			card-title="Titre de la carte"
			unique-id="card-id-exemple"
		>
			<p class="mb-0">
				Exemple de contenu principal
			</p>
		</AmeliproCard>
	</div>
</AmeliproMessagingLayout>`,
	}),
}
