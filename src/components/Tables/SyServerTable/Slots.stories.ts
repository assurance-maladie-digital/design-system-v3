import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes } from '../common/storyArgTypes'
import { serverUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Slots',
	component: SyServerTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		...commonTableArgTypes,
		items: {
			description: 'Liste des éléments à afficher dans le tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
				defaultValue: { summary: 'undefined' },
			},
		},
		serverItemsLength: {
			description: 'Nombre total d\'éléments à afficher',
			control: { type: 'number' },
		},
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

const serverHeaders = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', key: 'email' },
]

const defaultSortOptions = {
	itemsPerPage: 5,
	sortBy: [{ key: 'lastname', order: 'asc' as const }],
	page: 1,
}

// Jeu spécifique à l'affichage complexe : période imbriquée + statut.
const projectHeaders = [
	{ title: 'Titre', key: 'title' },
	{ title: 'Période', key: 'period' },
	{ title: 'Statut', key: 'status' },
]

const projectItems = [
	{ title: 'Projet Alpha', period: { start: '2023-01-01', end: '2023-06-30' }, status: 'En cours' },
	{ title: 'Projet Beta', period: { start: '2022-05-15', end: '2022-12-15' }, status: 'Terminé' },
	{ title: 'Projet Gamma', period: { start: '2023-03-01', end: '2023-09-30' }, status: 'En cours' },
	{ title: 'Projet Delta', period: { start: '2021-11-01', end: '2022-04-30' }, status: 'Terminé' },
	{ title: 'Projet Epsilon', period: { start: '2023-07-01', end: '2023-12-31' }, status: 'À venir' },
	{ title: 'Projet Zeta', period: { start: '2022-02-01', end: '2022-08-31' }, status: 'Terminé' },
]

const serverScript = `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable } from '@cnamts/synapse'
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import type { DataOptions } from '@cnamts/synapse/src/components/Tables/common/types'

	const users = ref([])
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({
		itemsPerPage: 5,
		sortBy: [{ key: 'lastname', order: 'asc' }],
		page: 1,
	})

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	async function fetchData() {
		state.value = StateEnum.PENDING
		const { items, total } = await getDataFromApi(options.value as DataOptions)
		users.value = items
		totalUsers.value = total
		state.value = StateEnum.RESOLVED
	}

	fetchData()
</script>
`

/**
 * Slot `#item` côté serveur : remplace entièrement le rendu d'une ligne.
 */
export const SlotItem: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		v-model:options="options"
		:items="users"
		:headers="headers"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="server-slot-item"
		@update:options="fetchData"
	>
		<template #item="{ item }">
			<tr>
				<td>{{ item.lastname }}</td>
				<td>
					<a href="#" class="text-primary">{{ item.firstname }}</a>
				</td>
				<td>{{ item.email }}</td>
			</tr>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: serverScript,
			},
		],
	},
	args: {
		'options': { ...defaultSortOptions },
		'headers': serverHeaders,
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'server-slot-item',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			>
				<template #item="{ item }">
					<tr>
						<td>{{ item.lastname }}</td>
						<td>
							<a href="#" class="text-primary">{{ item.firstname }}</a>
						</td>
						<td>{{ item.email }}</td>
					</tr>
				</template>
			</SyServerTable>
		`,
	}),
}

/**
 * Slot `#headers` côté serveur : personnalise entièrement la ligne d'en-tête.
 */
export const SlotHeaders: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		v-model:options="options"
		:items="users"
		:headers="headers"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="server-slot-headers"
		@update:options="fetchData"
	>
		<template #headers="{ columns }">
			<tr>
				<th v-for="column in columns" :key="column.key">
					<span class="font-weight-bold text-primary">{{ column.title }}</span>
				</th>
			</tr>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: serverScript,
			},
		],
	},
	args: {
		'options': { ...defaultSortOptions },
		'headers': serverHeaders,
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'server-slot-headers',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			>
				<template #headers="{ columns }">
					<tr>
						<th v-for="column in columns" :key="column.key">
							<span class="font-weight-bold text-primary">{{ column.title }}</span>
						</th>
					</tr>
				</template>
			</SyServerTable>
		`,
	}),
}

/**
 * Slot `#header.<key>` côté serveur : personnalise l'en-tête d'une seule colonne.
 */
export const SlotHeader: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		v-model:options="options"
		:items="users"
		:headers="headers"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="server-slot-header"
		@update:options="fetchData"
	>
		<template #header.lastname>
			<span class="text-primary font-weight-bold">Nom de famille</span>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: serverScript,
			},
		],
	},
	args: {
		'options': { ...defaultSortOptions },
		'headers': serverHeaders,
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'server-slot-header',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			>
				<template #header.lastname>
					<span class="text-primary font-weight-bold">Nom de famille</span>
				</template>
			</SyServerTable>
		`,
	}),
}

/**
 * Slot `#item.<key>` côté serveur : personnalise l'affichage d'une cellule (ici
 * une période imbriquée reformatée en texte).
 */
export const ComplexItemsDisplay: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		v-model:options="options"
		:items="items"
		:headers="headers"
		:server-items-length="totalItems"
		:loading="state === StateEnum.PENDING"
		suffix="server-complex-item"
		@update:options="fetchData"
	>
		<template #[\`item.period\`]="{ item }">
			<span>Depuis le {{ item.period.start }} jusqu'au {{ item.period.end }}</span>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable } from '@cnamts/synapse'
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import type { DataOptions } from '@cnamts/synapse/src/components/Tables/common/types'

	const items = ref([])
	const totalItems = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({
		itemsPerPage: 5,
		sortBy: [{ key: 'title', order: 'asc' }],
		page: 1,
	})

	const headers = [
		{ title: 'Titre', key: 'title' },
		{ title: 'Période', key: 'period' },
		{ title: 'Statut', key: 'status' },
	]

	async function fetchData() {
		state.value = StateEnum.PENDING
		const { items: rows, total } = await getDataFromApi(options.value as DataOptions)
		items.value = rows
		totalItems.value = total
		state.value = StateEnum.RESOLVED
	}

	fetchData()
</script>
`,
			},
		],
	},
	args: {
		'options': {
			itemsPerPage: 5,
			sortBy: [{ key: 'title', order: 'asc' }],
			page: 1,
		},
		'headers': projectHeaders,
		'caption': '',
		'serverItemsLength': 6,
		'suffix': 'server-complex-item',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, projectItems)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			>
				<template #[\`item.period\`]="{ item }">
					<span>Depuis le {{ item.period.start }} jusqu'au {{ item.period.end }}</span>
				</template>
			</SyServerTable>
		`,
	}),
}
