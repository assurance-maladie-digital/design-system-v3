import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes } from '../common/storyArgTypes'
import { serverUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Sélection',
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
	{ title: 'Email', value: 'email' },
]

/**
 * Sélection multiple côté serveur : `show-select` ajoute une colonne de cases à
 * cocher. La sélection reste un `v-model` local (indépendant du « fetch »).
 */
export const RowSelection: Story = {
	name: 'Row Selection',
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
		v-model="selection"
		:headers="headers"
		:items="users"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		show-select
		suffix="selection-server-table"
		@update:options="fetchData"
	/>
	<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
		<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
		<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
			<div><strong>Nom :</strong> {{ item.lastname }}</div>
			<div><strong>Prénom :</strong> {{ item.firstname }}</div>
			<div><strong>Email :</strong> {{ item.email }}</div>
		</div>
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

	const selection = ref([])
	const users = ref([])
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({ itemsPerPage: 5, page: 1 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	]

	// La sélection est un v-model indépendant du chargement serveur
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
		'options': { itemsPerPage: 5, page: 1 },
		'headers': serverHeaders,
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'selection-server-table',
		'density': 'default',
		'striped': false,
		'showSelect': true,
		'onUpdate:options': fn(),
		'onUpdate:modelValue': fn(),
		'onRow-click': fn(),
		'onEdit': fn(),
		'onSave': fn(),
		'onCancel': fn(),
		'onDelete': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			const selection = ref<Record<string, unknown>[]>([])
			return { args, items, totalItems, state, options, fetchData, StateEnum, selection }
		},
		template: `
			<div>
				<SyServerTable
					v-bind="args"
					v-model:options="options"
					v-model="selection"
					:items="items"
					:server-items-length="totalItems"
					:loading="state === StateEnum.PENDING"
					@update:options="fetchData"
				/>
				<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
					<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ item.lastname }}</div>
						<div><strong>Prénom :</strong> {{ item.firstname }}</div>
						<div><strong>Email :</strong> {{ item.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}

/**
 * Sélection unique côté serveur : `show-select-single` limite la sélection à une
 * seule ligne (boutons radio). Le `v-model` contient au plus un élément.
 */
export const SingleRowSelection: Story = {
	name: 'Single Row Selection',
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
		v-model="selection"
		:headers="headers"
		:items="users"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		show-select-single
		suffix="selection-server-table"
		@update:options="fetchData"
	/>
	<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
		<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
		<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
			<div><strong>Nom :</strong> {{ item.lastname }}</div>
			<div><strong>Prénom :</strong> {{ item.firstname }}</div>
			<div><strong>Email :</strong> {{ item.email }}</div>
		</div>
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

	const selection = ref([])
	const users = ref([])
	const totalUsers = ref(0)
	const state = ref(StateEnum.IDLE)

	const options = ref({ itemsPerPage: 5, page: 1 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
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
		'options': { itemsPerPage: 5, page: 1 },
		'headers': serverHeaders,
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'selection-server-table',
		'density': 'default',
		'striped': false,
		'showSelectSingle': true,
		'onUpdate:options': fn(),
		'onUpdate:modelValue': fn(),
		'onRow-click': fn(),
		'onEdit': fn(),
		'onSave': fn(),
		'onCancel': fn(),
		'onDelete': fn(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			const selection = ref<Record<string, unknown>[]>([])
			return { args, items, totalItems, state, options, fetchData, StateEnum, selection }
		},
		template: `
			<div>
				<SyServerTable
					v-bind="args"
					v-model:options="options"
					v-model="selection"
					:items="items"
					:server-items-length="totalItems"
					:loading="state === StateEnum.PENDING"
					@update:options="fetchData"
				/>
				<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
					<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ item.lastname }}</div>
						<div><strong>Prénom :</strong> {{ item.firstname }}</div>
						<div><strong>Email :</strong> {{ item.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}
