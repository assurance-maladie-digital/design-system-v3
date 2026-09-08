import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes, commonTableExcludedControls, syTableItemsArgTypes } from '../common/storyArgTypes'
import { users, usersHeaders } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Tri',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: commonTableExcludedControls },
	},
	argTypes: {
		...commonTableArgTypes,
		...syTableItemsArgTypes,
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

// Jeu de données spécifique au tri multiple (colonne Ville + un doublon de nom
// pour illustrer le tri secondaire).
const multiSortHeaders = [
	...usersHeaders,
	{ title: 'Ville', key: 'city' },
]

const multiSortItems = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', city: 'Paris' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com', city: 'Lyon' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', city: 'Marseille' },
	{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com', city: 'Toulouse' },
	{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@exemple.com', city: 'Nice' },
	{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@exemple.com', city: 'Bordeaux' },
	{ firstname: 'Agate', lastname: 'Beauchesne', email: 'agate.beauchesne@exemple.com', city: 'Lille' },
]

/**
 * Tri simple : clic sur l'en-tête d'une colonne. L'état de tri est piloté par
 * `v-model:options` (`sortBy`).
 */
export const SortBy: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		v-model:options="options"
		:headers="headers"
		:items="items"
		show-filters
		suffix="sort-table"
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({
		itemsPerPage: 4,
		sortBy: [
			{ key: 'lastname', order: 'desc' },
		],
	})

	const headers = ref([
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	])

	const items = ref([
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
		{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@exemple.com' },
		{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@exemple.com' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': users,
		'caption': '',
		'options': {
			itemsPerPage: 4,
			sortBy: [
				{ key: 'lastname', order: 'desc' },
			],
		},
		'suffix': 'sort-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" />
		`,
	}),
}

/**
 * Tri multiple (`multi-sort`) : un chiffre à côté de l'icône de tri indique
 * l'ordre de priorité des colonnes triées.
 */
export const MultiSort: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		v-model:options="options"
		:headers="headers"
		:items="items"
		:multi-sort="true"
		suffix="multi-sort-table"
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({
		itemsPerPage: 4,
		multiSort: true,
		sortBy: [
			{ key: 'lastname', order: 'desc' },
			{ key: 'firstname', order: 'asc' },
		],
	})

	const headers = ref([
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
		{ title: 'Ville', key: 'city' },
	])

	const items = ref([
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', city: 'Paris' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', city: 'Marseille' },
		{ firstname: 'Agate', lastname: 'Beauchesne', email: 'agate.beauchesne@exemple.com', city: 'Lille' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': multiSortHeaders,
		'items': multiSortItems,
		'caption': '',
		'options': {
			itemsPerPage: 4,
			multiSort: true,
			sortBy: [
				{ key: 'lastname', order: 'desc' },
				{ key: 'firstname', order: 'asc' },
			],
		},
		'suffix': 'multi-sort-table',
		'density': 'default',
		'striped': false,
		'multiSort': true,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<div>
				<p class="mb-4">
					Cet exemple montre le tri multiple avec des indicateurs d'ordre de priorité.
					Les chiffres à côté des icônes de tri indiquent l'ordre de priorité du tri.
				</p>
				<SyTable v-model:options="args.options" v-bind="args" suffix="multi-sort-table" />
			</div>
		`,
	}),
}
