import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs } from '../common/storyArgTypes'
import { serverUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Tri',
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

// Jeu spécifique au tri multiple : un doublon de nom (« Beauchesne ») pour
// illustrer le tri secondaire par prénom.
const serverMultiSortDataset: Record<string, string>[] = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
	{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
	{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
	{ firstname: 'Agate', lastname: 'Beauchesne', email: 'agate.beauchesne@example.com' },
]

/**
 * Tri simple côté serveur : le tri est délégué au serveur via l'évènement
 * `@update:options`, qui déclenche un nouveau « fetch ».
 */
export const ServerSortBy: Story = {
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
		:headers="headers"
		:items="users"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="server-sort"
		@update:options="fetchData"
	/>
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

	const users = ref([])
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({
		itemsPerPage: 5,
		sortBy: [{ key: 'lastname', order: 'desc' }],
		page: 1,
	})

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	// Appelé à chaque changement d'options (tri, pagination) : requête serveur
	async function fetchData() {
		state.value = StateEnum.PENDING
		const { items, total } = await getDataFromApi(options.value as DataOptions)
		users.value = items
		totalUsers.value = total
		state.value = StateEnum.RESOLVED
	}

	fetchData()
</script>
`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'desc' }],
			page: 1,
		},
		headers: serverHeaders,
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-sort',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
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
			/>
		`,
	}),
}

/**
 * Tri multiple côté serveur (`multi-sort`) : un chiffre à côté de l'icône de tri
 * indique l'ordre de priorité des colonnes. Le serveur applique le tri multi-clés.
 */
export const ServerMultiSort: Story = {
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
		:headers="headers"
		:items="users"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		:multi-sort="true"
		suffix="server-multi-sort"
		@update:options="fetchData"
	/>
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

	const users = ref([])
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({
		itemsPerPage: 5,
		multiSort: true,
		sortBy: [
			{ key: 'lastname', order: 'desc' },
			{ key: 'firstname', order: 'asc' },
		],
		page: 1,
	})

	// Le serveur applique le tri multi-clés dans l'ordre de priorité de sortBy
	async function fetchData() {
		state.value = StateEnum.PENDING
		const { items, total } = await getDataFromApi(options.value as DataOptions)
		users.value = items
		totalUsers.value = total
		state.value = StateEnum.RESOLVED
	}

	fetchData()
</script>
`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			multiSort: true,
			sortBy: [
				{ key: 'lastname', order: 'desc' },
				{ key: 'firstname', order: 'asc' },
			],
			page: 1,
		},
		headers: serverHeaders,
		caption: '',
		serverItemsLength: 7,
		suffix: 'server-multi-sort',
		density: 'default',
		striped: false,
		multiSort: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverMultiSortDataset)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<div>
				<p class="mb-4">
					Cet exemple montre le tri multiple côté serveur avec des indicateurs d'ordre de priorité.
					Les chiffres à côté des icônes de tri indiquent l'ordre de priorité du tri.
				</p>
				<SyServerTable
					v-bind="args"
					v-model:options="options"
					:items="items"
					:server-items-length="totalItems"
					:loading="state === StateEnum.PENDING"
					@update:options="fetchData"
				/>
			</div>
		`,
	}),
}
