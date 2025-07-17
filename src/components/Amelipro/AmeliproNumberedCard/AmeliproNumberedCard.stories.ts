import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproNumberedCard from './AmeliproNumberedCard.vue'
import type { AmeliproNumberedCardItem } from './types'

const meta = {
	argTypes: {
		'`${id}-item-${index}`': { description: 'Pour gérer un affichage spécifique à une carte' },
		'`${id}-item`': { description: 'Pour gérer un affichage commun à toutes les cartes' },
		'borderColor': { description: 'Couleur des bordures de la card' },
		'bordered': { description: 'Permet d’activer ou de desactiver les bordures de la card' },
		'cardColor': { description: 'Couleur du background des cartes' },
		'contentClasses': { description: 'Classes custom pour le contenu de la card' },
		'items': {
			description: 'liste des cartes numérotées et de leurs propriétés',
			table: {
				type: {
					detail: `Array<{
	id: number;
	[key: string]: string | number;
}>`,
					summary: 'AmeliproNumberedCardItem[]',
				},
			},
		},
		'itemsPerLine': { description: 'Nombre de carte par ligne en desktop, au choix 2, 3 et 4' },
		'uniqueId': { description: 'Identifiant unique de la liste de cartes numérotées' },
	},
	component: AmeliproNumberedCard,
	title: 'Composants/Amelipro/Cartes/AmeliproNumberedCard',
} as Meta<typeof AmeliproNumberedCard>

export default meta

type Story = StoryObj<typeof meta>

const items: AmeliproNumberedCardItem[] = [
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		name: 'Pierre',
	},
]

export const Default: Story = {
	args: {
		items,
		itemsPerLine: 2,
		uniqueId: 'test',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproNumberedCard
		:items-per-line="2"
		:items="items"
		unique-id="test"
	>
		<template #test-item>
			<p class="mb-0">
				[Slot: id-item]
			</p>
		</template>

		<template #test-item-1>
			<p class="mb-0">
				[Slot: id-item-1]
			</p>
		</template>
	</AmeliproNumberedCard>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproNumberedCard } from '@cnamts/synapse'

	const items = [
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			name: 'Souris',
		},
		{
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			name: 'Pierre',
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproNumberedCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproNumberedCard
	:items-per-line="args.itemsPerLine"
	:items="args.items"
	:unique-id="args.id"
	v-bind="args"
>
	<template #test-item>
		<p class="mb-0">
			[Slot: id-item]
		</p>
	</template>

	<template #test-item-1>
		<p class="mb-0">
			[Slot: id-item-1]
		</p>
	</template>
</AmeliproNumberedCard>`,
	}),
}
