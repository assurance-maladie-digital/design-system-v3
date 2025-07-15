import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPagination from './AmeliproPagination.vue'

const meta = {
	argTypes: {
		activePageDefault: { description: 'Numéro de page active par défaut' },
		click: {
			action: 'click',
			description: 'Événement émis lorsque l’utilisateur clique sur un des boutons. Retourne le numéro de page active',
			type: 'number',
		},
		items: {
			description: 'Liste des pages composants la pagination, la propriété key étant le numéro de la page',
			table: {
				type: {
					detail: `Array<{
	key: number;
	href?: string;
	to?: string
}>`,
					summary: 'PaginationTypes[]',
				},
			},
		},
		uniqueId: { description: 'Identifiant unique de la pagination' },
	},
	component: AmeliproPagination,
	title: 'Composants/Amelipro/AmeliproPagination',
} as Meta<typeof AmeliproPagination>
export default meta

type Story = StoryObj<typeof AmeliproPagination>

const items = [
	{ key: 1 },
	{ key: 2 },
	{ key: 3 },
	{ key: 4 },
	{ key: 5 },
	{ key: 6 },
	{ key: 7 },
	{ key: 8 },
	{ key: 9 },
	{ key: 10 },
]

export const Default: Story = {
	args: {
		activePageDefault: 1,
		items,
		uniqueId: 'amelipro-pagination-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproPagination
		:active-page-default="1"
		:items="items5"
		unique-id="amelipro-pagination-unique-id"
		@click="args['click']"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	const items = [
		{ key: 1 },
		{ key: 2 },
		{ key: 3 },
		{ key: 4 },
		{ key: 5 },
		{ key: 6 },
		{ key: 7 },
		{ key: 8 },
		{ key: 9 },
		{ key: 10 },
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPagination },
		setup() {
			return { args }
		},
		template: `
			<AmeliproPagination
				v-bind="args"
				@click="args['click']"
			/>
		`,
	}),

}
