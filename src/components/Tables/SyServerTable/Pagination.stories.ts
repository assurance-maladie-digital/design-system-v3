import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs, commonTableExcludedControls, syServerTableItemsArgTypes } from '../common/storyArgTypes'
import { serverUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Pagination',
	component: SyServerTable,
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
		...syServerTableItemsArgTypes,
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

const serverHeaders = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', key: 'email' },
]

// Jeux dérivés du dataset serveur partagé.
const sixUsers = serverUsers.slice(0, 6)
const elevenUsers = serverUsers.slice(0, 11)

/**
 * Choix du nombre de lignes par page côté serveur (`items-per-page-options`) :
 * chaque changement déclenche un nouveau « fetch ».
 */
export const ItemsPerPageOptions: Story = {
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
		:items-per-page-options="[5, 10, 15]"
		:server-items-length="totalUsers"
		:loading="state === StateEnum.PENDING"
		suffix="server-default"
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
		itemsPerPageOptions: [5, 10, 15],
		headers: serverHeaders,
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-default',
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
				:items-per-page-options="args.itemsPerPageOptions"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			/>
		`,
	}),
}

/**
 * Masquer le pied de page côté serveur (`hide-default-footer`) : ici toutes les
 * lignes sont renvoyées (`itemsPerPage: -1`).
 */
export const HideDefaultFooter: Story = {
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
		suffix="server-hide-footer"
		hide-default-footer
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
	const options = ref({ itemsPerPage: -1, page: 1 })

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
		options: { itemsPerPage: -1, page: 1 },
		headers: serverHeaders,
		serverItemsLength: 6,
		suffix: 'server-hide-footer',
		density: 'default',
		striped: false,
		hideDefaultFooter: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, sixUsers)
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
 * Saisie directe de la page côté serveur (`page-input`) : un champ numérique
 * permet d'aller directement à une page donnée.
 */
export const PageInput: Story = {
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
		suffix="server-page-input"
		page-input
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
	const options = ref({ itemsPerPage: 5, page: 1 })

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
		options: { itemsPerPage: 5, page: 1 },
		headers: serverHeaders,
		serverItemsLength: 11,
		suffix: 'server-page-input',
		density: 'default',
		striped: false,
		pageInput: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, elevenUsers)
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
