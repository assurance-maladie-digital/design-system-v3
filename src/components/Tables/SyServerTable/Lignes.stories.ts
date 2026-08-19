import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, defineComponent, ref } from 'vue'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs } from '../common/storyArgTypes'
import { StateEnum } from '../common/constants/StateEnum'
import type { DataOptions } from '../common/types'
import { serverUsers } from '../common/storyData'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Lignes',
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

const clickableUsers = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Alice', lastname: 'Dupont', email: 'alice.dupont@example.com' },
	{ firstname: 'Marc', lastname: 'Lefevre', email: 'marc.lefevre@example.com' },
]

/**
 * Lignes cliquables côté serveur (`clickable-row`) : chaque clic émet `@row-click`
 * avec l'élément de la ligne, indépendamment du chargement serveur.
 */
export const ClickableRow: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<SyServerTable
			v-model:options="options"
			:headers="headers"
			:items="users"
			:server-items-length="totalUsers"
			:loading="state === StateEnum.PENDING"
			clickable-row
			suffix="clickable-row-server-table"
			@update:options="fetchData"
			@row-click="selectedRow = $event"
		/>
		<div v-if="selectedRow" class="mt-4 pa-4 bg-grey-lighten-4">
			<h3 class="text-h6 mb-3">Ligne cliquée</h3>
			<div class="pa-2 bg-grey-lighten-3">
				<div><strong>Nom :</strong> {{ selectedRow.lastname }}</div>
				<div><strong>Prénom :</strong> {{ selectedRow.firstname }}</div>
				<div><strong>Email :</strong> {{ selectedRow.email }}</div>
			</div>
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

	const options = ref({ itemsPerPage: 5, filters: [] })
	const selectedRow = ref(null)
	const state = ref(StateEnum.IDLE)
	const totalUsers = ref(0)
	const users = ref([])

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const allUsers = [
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Alice', lastname: 'Dupont', email: 'alice.dupont@example.com' },
		{ firstname: 'Marc', lastname: 'Lefevre', email: 'marc.lefevre@example.com' },
	]

	const fetchData = async (): Promise<void> => {
		state.value = StateEnum.PENDING
		await new Promise(resolve => setTimeout(resolve, 500))

		const { page = 1, itemsPerPage = 5 } = options.value as DataOptions
		totalUsers.value = allUsers.length
		users.value = itemsPerPage > 0
			? allUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			: allUsers

		state.value = StateEnum.RESOLVED
	}

	fetchData()
</script>
`,
			},
		],
	},
	args: {
		headers: serverHeaders,
		items: clickableUsers,
		serverItemsLength: 4,
		options: { itemsPerPage: 5, filters: [] },
		clickableRow: true,
		suffix: 'clickable-row-server-table',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: {
			ClickableRowServerTableCanvas: defineComponent({
				components: { SyServerTable },
				emits: ['row-click'],
				setup() {
					const options = ref<DataOptions>({
						itemsPerPage: 5,
						page: 1,
						sortBy: [],
						filters: [],
						...(args.options ?? {}),
					})
					const state = ref(StateEnum.IDLE)
					const totalUsers = ref(0)
					const users = ref<Record<string, unknown>[]>([])
					const allUsers = clickableUsers
					const boundArgs = computed(() => {
						return Object.fromEntries(
							Object.entries(args).filter(([key]) => !['items', 'options', 'serverItemsLength', 'onRow-click'].includes(key)),
						)
					})

					const fetchData = async (nextOptions?: DataOptions) => {
						if (nextOptions) {
							options.value = { ...options.value, ...nextOptions }
						}

						state.value = StateEnum.PENDING
						await new Promise(resolve => setTimeout(resolve, 500))

						const items = [...allUsers]
						const { page = 1, itemsPerPage = 5, sortBy = [] } = options.value

						if (sortBy.length > 0) {
							const [firstSort] = sortBy
							if (firstSort?.key && firstSort.order) {
								items.sort((a, b) => {
									const left = String(a[firstSort.key] ?? '')
									const right = String(b[firstSort.key] ?? '')
									return firstSort.order === 'asc'
										? left.localeCompare(right)
										: right.localeCompare(left)
								})
							}
						}

						totalUsers.value = items.length
						users.value = itemsPerPage > 0
							? items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
							: items

						state.value = StateEnum.RESOLVED
					}

					fetchData()

					return { boundArgs, fetchData, options, state, totalUsers, users, StateEnum }
				},
				template: `
					<SyServerTable
						v-model:options="options"
						v-bind="boundArgs"
						:items="users"
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						@update:options="[fetchData, boundArgs['onUpdate:options']]"
						@row-click="$emit('row-click', $event)"
					/>
				`,
			}),
		},
		setup() {
			const selectedRow = ref<Record<string, unknown> | null>(null)
			const handleRowClick = (item: Record<string, unknown>) => {
				selectedRow.value = item
				args['onRow-click']?.(item)
			}
			return { selectedRow, handleRowClick }
		},
		template: `
			<div>
				<ClickableRowServerTableCanvas @row-click="handleRowClick" />
				<div v-if="selectedRow" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Ligne cliquée</h3>
					<div class="pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ selectedRow.lastname }}</div>
						<div><strong>Prénom :</strong> {{ selectedRow.firstname }}</div>
						<div><strong>Email :</strong> {{ selectedRow.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}

/**
 * Lignes dépliables côté serveur (`show-expand`) : le slot
 * `#item.data-table-expand` personnalise le déclencheur, et `#expanded-row` le
 * contenu déplié. Le chargement serveur est mutualisé via `useServerTableDemo`.
 */
export const ExpandableRows: Story = {
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
		show-expand
		caption="Tableau complexe"
		suffix="server-expandable"
		@update:options="fetchData"
	>
		<template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
			<v-btn
				:append-icon="isExpanded(internalItem) ? mdiChevronUp : mdiChevronDown"
				:text="isExpanded(internalItem) ? 'Fermer' : \`Plus d'info\`"
				class="text-none"
				color="medium-emphasis"
				size="small"
				variant="text"
				width="105"
				border
				slim
				@click="toggleExpand(internalItem)"
			/>
		</template>

		<template #expanded-row="{ columns, item }">
			<tr>
				<td :colspan="columns.length" class="py-2">
					<strong>Informations complémentaires :</strong>
					<p>Plus de détails pour {{ item.firstname }} {{ item.lastname }}.</p>
				</td>
			</tr>
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
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

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
		showExpand: true,
		suffix: 'server-expandable',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverUsers)
			return { args, items, totalItems, state, options, fetchData, StateEnum, mdiChevronDown, mdiChevronUp }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				show-expand
				caption="Tableau complexe"
				suffix="server-expandable"
				@update:options="fetchData"
			>
				<template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
					<VBtn
						:append-icon="isExpanded(internalItem) ? mdiChevronUp : mdiChevronDown"
						:text="isExpanded(internalItem) ? 'Fermer' : \`Plus d'info\`"
						class="text-none"
						color="medium-emphasis"
						size="small"
						variant="text"
						width="105"
						border
						slim
						@click="toggleExpand(internalItem)"
					/>
				</template>

				<template #expanded-row="{ columns, item }">
					<tr>
						<td :colspan="columns.length" class="py-2">
							<strong>Informations complémentaires :</strong>
							<p>Plus de détails pour {{ item.firstname }} {{ item.lastname }}.</p>
						</td>
					</tr>
				</template>
			</SyServerTable>
		`,
	}),
}
