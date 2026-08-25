import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs } from '../common/storyArgTypes'
import type { DataTableHeaders } from '../common/types'
import { serverUsers, wideHeaders, wideServerUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Colonnes',
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

const alignmentHeaders: DataTableHeaders[] = [
	{ title: 'ID', key: 'id', align: 'center' },
	{ title: 'Nom', key: 'lastname', align: 'start' },
	{ title: 'Date de naissance', key: 'birthdate', align: 'center' },
	{ title: 'NIR', key: 'nir', align: 'end' },
]

const alignmentData = [
	{ id: '1', lastname: 'Lefebvre', birthdate: '18/02/1989', nir: '1 89 02 75 120 005 79' },
	{ id: '2', lastname: 'Richard', birthdate: '22/05/1991', nir: '2 91 05 75 120 005 76' },
	{ id: '3', lastname: 'Fournier', birthdate: '11/11/2000', nir: '2 00 11 42 120 008 87' },
]

/**
 * Alignement des colonnes côté serveur (`align`) : chaque en-tête aligne son
 * contenu `start`, `center` ou `end`.
 */
export const DataAlignment: Story = {
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
		suffix="server-data-alignment"
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
		sortBy: [{ key: 'lastname', order: 'asc' }],
		page: 1,
	})

	const headers = [
		{ title: 'ID', key: 'id', align: 'center' },
		{ title: 'Nom', key: 'lastname', align: 'start' },
		{ title: 'Date de naissance', key: 'birthdate', align: 'center' },
		{ title: 'NIR', key: 'nir', align: 'end' },
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
`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'asc' }],
			page: 1,
		},
		headers: alignmentHeaders,
		caption: '',
		serverItemsLength: 3,
		suffix: 'server-data-alignment',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, alignmentData)
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
 * Colonnes redimensionnables côté serveur (`resizable-columns`) : une poignée sur
 * le bord des en-têtes permet d'ajuster la largeur des colonnes.
 */
export const ResizableColumns: Story = {
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
		:resizable-columns="true"
		suffix="server-resizable-columns"
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
`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'asc' }],
			page: 1,
		},
		headers: serverHeaders,
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-resizable-columns',
		density: 'default',
		striped: false,
		resizableColumns: true,
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
 * Colonnes épinglées côté serveur (`pinned-columns`) et sélection collante
 * (`sticky-select`) : certaines colonnes restent visibles lors du défilement
 * horizontal, à travers la pagination serveur.
 */
export const PinnedColumns: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 900px; overflow: auto;">
		<SyServerTable
			v-model:options="options"
			:headers="headers"
			:items="items"
			:server-items-length="totalUsers"
			:loading="state === StateEnum.PENDING"
			show-select
			sticky-select
			:pinned-columns="pinnedColumns"
			suffix="server-pinned-columns"
			@update:options="fetchData"
		/>
	</div>
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
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)
	const options = ref({ itemsPerPage: 5, page: 1 })

	const headers = [
		{ title: 'ID', key: 'id', width: 80 },
		{ title: 'Nom', key: 'lastname', width: 160 },
		{ title: 'Prénom', key: 'firstname', width: 160 },
		{ title: 'Email', key: 'email', width: 240 },
		{ title: 'Ville', key: 'city', width: 160 },
		{ title: 'Pays', key: 'country', width: 160 },
		{ title: 'Téléphone', key: 'phone', width: 180 },
		{ title: 'Statut', key: 'status', width: 140 },
		{ title: 'Dernière connexion', key: 'lastLogin', width: 200 },
		{ title: 'Actions', key: 'actions', width: 140 },
	]

	const pinnedColumns = ref([
		{ key: 'actions', side: 'right' },
	])

	async function fetchData() {
		state.value = StateEnum.PENDING
		const { items: rows, total } = await getDataFromApi(options.value as DataOptions)
		items.value = rows
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
		options: { itemsPerPage: 5, page: 1 },
		headers: wideHeaders,
		serverItemsLength: 30,
		suffix: 'server-pinned-columns',
		showSelect: true,
		stickySelect: true,
		pinnedColumns: [
			{ key: 'actions', side: 'right' },
		],
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, wideServerUsers)
			return { args, items, totalItems, state, options, fetchData, StateEnum }
		},
		template: `
			<div style="max-width: 900px; overflow: auto;">
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

/**
 * Contrôles de colonnes côté serveur (`enable-column-controls`) : réordonner et
 * afficher/masquer les colonnes.
 */
export const ColumnControls: Story = {
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
		suffix="server-control-columns"
		enable-column-controls
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
`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'asc' }],
			page: 1,
		},
		headers: serverHeaders,
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-control-columns',
		density: 'default',
		striped: false,
		enableColumnControls: true,
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
