import type { Meta, StoryObj } from '@storybook/vue3'
import PaginatedTable from './PaginatedTable.vue'
import { StateEnum } from './constants/StateEnum'
import type { DataOptions } from './types'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'

interface User {
	[key: string]: string
	firstname: string
	lastname: string
	email: string
}

interface DataObj {
	items: User[]
	total: number
}

const meta = {
	title: 'Composants/Tableaux/PaginatedTable',
	component: PaginatedTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		headers: {
			description: 'Liste des colonnes du tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
			},
		},
		items: {
			description: 'Liste des éléments à afficher dans le tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
			},
		},
		options: {
			description: 'Options de configuration du tableau',
			name: 'v-model:options',
			control: { type: 'object' },
			table: {
				category: 'props',
			},
		},
		serverItemsLength: {
			description: 'Nombre total d\'éléments à afficher',
			control: { type: 'number' },
		},
		suffix: {
			description: 'Suffixe permettant de gérer individuellement le stockage des options d’un tableau d’une page à l’autre. S’il n’est pas renseigné, le stockage s’effectue globalement pour tous les tableaux.',
			control: { type: 'text' },
		},
		itemsPerPage: {
			description: 'Nombre d\'éléments par page',
			control: { type: 'number' },
		},
		caption: {
			description: 'Texte de la légende du tableau',
			control: { type: 'text' },
		},
		multiSort: {
			description: 'Permet de trier sur plusieurs colonnes simultanément. Lorsque activé, des indicateurs numériques apparaissent à côté des icônes de tri pour montrer l\'ordre de priorité.',
			control: { type: 'boolean' },
			table: {
				category: 'props',
				type: { summary: 'boolean' },
				defaultValue: {
					summary: 'false',
				},
			},
		},
		mustSort: {
			description: 'Force au moins une colonne à être toujours triée. Si désactivé, toutes les colonnes peuvent être non triées.',
			control: { type: 'boolean' },
			table: {
				category: 'props',
				type: { summary: 'boolean' },
				defaultValue: {
					summary: 'false',
				},
			},
		},
	},
} satisfies Meta<typeof PaginatedTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						caption="Liste des utilisateurs"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 4,
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'lastname',
						},
						{
							title: 'Prénom',
							key: 'firstname',
						},
						{
                            title: 'Email',
							value: 'email',
						},
					])
						
					const items = ref([
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							email: 'virginie.beauchesne@example.com',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							email: 'simone.bellefeuille@example.com',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							email: 'etienne.salois@example.com',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							email: 'thierry.bobu@example.com',
						},
						{
							firstname: 'Bernadette',
							lastname: 'Langelier',
							email: 'bernadette.langelier@exemple.com'
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							email: 'agate.roy@exemple.com'
						}
					])
				</script>
				`,
			},
		],
	},
	args: {
		// @ts-expect-error - props of VDataTable
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
			},
			{
				title: 'Prénom',
				key: 'firstname',
			},
			{
				title: 'Email',
				value: 'email',
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				email: 'virginie.beauchesne@example.com',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				email: 'simone.bellefeuille@example.com',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				email: 'etienne.salois@example.com',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				email: 'thierry.bobu@example.com',
			},
			{
				firstname: 'Bernadette',
				lastname: 'Langelier',
				email: 'bernadette.langelier@exemple.com',
			},
			{
				firstname: 'Agate',
				lastname: 'Roy',
				email: 'agate.roy@exemple.com',
			},
		],
		caption: 'Liste des utilisateurs',
		options: {
			itemsPerPage: 4,
		},
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<PaginatedTable
						v-model:options="args.options"
						:items="args.items"
						:headers="args.headers"
						:caption="args.caption"
					/>
				</div>
			`,
		}
	},
}

export const SortBy: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						caption="Liste des utilisateurs"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const options = ref({
						sortBy: [{ key: 'lastname', order: 'desc' }],
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'lastname',
						},
						{
							title: 'Prénom',
							key: 'firstname',
						},
						{
							title: 'Email',
							value: 'email',
						},
					])
						
					const items = ref([
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							email: 'virginie.beauchesne@example.com',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							email: 'simone.bellefeuille@example.com',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							email: 'etienne.salois@example.com',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							email: 'thierry.bobu@example.com',
						},
						{
							firstname: 'Bernadette',
							lastname: 'Langelier',
							email: 'bernadette.langelier@exemple.com'
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							email: 'agate.roy@exemple.com'
						}
					])
				</script>
				`,
			},
		],
	},
	args: {
		// @ts-expect-error - props of VDataTable
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
			},
			{
				title: 'Prénom',
				key: 'firstname',
			},
			{
				title: 'Email',
				value: 'email',
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				email: 'virginie.beauchesne@example.com',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				email: 'simone.bellefeuille@example.com',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				email: 'etienne.salois@example.com',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				email: 'thierry.bobu@example.com',
			},
			{
				firstname: 'Bernadette',
				lastname: 'Langelier',
				email: 'bernadette.langelier@exemple.com',
			},
			{
				firstname: 'Agate',
				lastname: 'Roy',
				email: 'agate.roy@exemple.com',
			},
		],
		caption: 'Liste des utilisateurs',
		options: {
			sortBy: [{ key: 'lastname', order: 'desc' }],
		},
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				return { args }
			},
			template: `
			<div class="pa-4">
				<PaginatedTable
					v-model:options="args.options"
					:items="args.items"
					:headers="args.headers"
					:caption="args.caption"
				/>
			</div>
			`,
		}
	},
}

export const TableServer: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						v-model:options="options"
						:items="users"
						:headers="headers"
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						suffix="api-example"
						caption="Liste des utilisateurs"
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
					import { PaginatedTable } from '@cnamts/synapse'
					import { StateEnum } from '@cnamts/synapse/src/components/PaginatedTable/constants/StateEnum'
					import type { DataOptions } from '@cnamts/synapse/src/components/PaginatedTable/types'
				
					interface User {
						[key: string]: string
						firstname: string
						lastname: string
						email: string
					}
				
					interface DataObj {
						items: User[]
						total: number
					}
				
					const totalUsers = ref(0)
					const users = ref<User[]>([])
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
				
					const fetchData = async (): Promise<void> => {
						const { items, total } = await getDataFromApi(options.value)
						users.value = items
						totalUsers.value = total
						console.log(users.value, totalUsers.value)
					}
				
					const wait = async (ms: number) => {
						return new Promise(resolve => setTimeout(resolve, ms))
					}
				
					const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
						state.value = StateEnum.PENDING
						await wait(1000)
				
						return new Promise((resolve) => {
							let items: User[] = getUsers()
							const total = items.length
				
							if (sortBy && sortBy.length > 0) {
								items = items.sort((a, b) => {
									const key = sortBy[0].key
									const order = sortBy[0].order === 'asc' ? 1 : -1
				
									return a[key] > b[key] ? order : -order
								})
							}
				
							if (itemsPerPage > 0) {
								items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
							}
				
							resolve({ items, total })
							state.value = StateEnum.RESOLVED
						})
					}
				
					const getUsers = (): User[] => {
						return [
							{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
							{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
							{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
							{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
							{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
							{ firstname: 'Louis', lastname: 'Denis', email: 'louis.denis@example.com' },
							{ firstname: 'Édith', lastname: 'Cartier', email: 'edith.cartier@example.com' },
							{ firstname: 'Alphonse', lastname: 'Bouvier', email: 'alphonse.bouvier@example.com' },
							{ firstname: 'Eustache', lastname: 'Dubois', email: 'eustache.dubois@example.com' },
							{ firstname: 'Rosemarie', lastname: 'Quessy', email: 'rosemarie.quessy@example.com' },
							{ firstname: 'Serge', lastname: 'Rivard', email: 'serge.rivard@example.com' },
							{ firstname: 'Jacques', lastname: 'Demers', email: 'jacques.demers@example.com' },
							{ firstname: 'Aimée', lastname: 'Josseaume', email: 'aimee.josseaume@example.com' },
							{ firstname: 'Delphine', lastname: 'Robillard', email: 'delphine.robillard@example.com' },
							{ firstname: 'Alexandre', lastname: 'Lazure', email: 'alexandre.lazure@example.com' },
						]
					}
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
		caption: 'Liste des utilisateurs',
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
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

				const fetchData = async (): Promise<void> => {
					// @ts-expect-error - fetchData is not defined
					const { items, total } = await getDataFromApi(options.value)
					users.value = items
					totalUsers.value = total

					console.log(users.value, totalUsers.value)
				}

				const wait = async (ms: number) => {
					return new Promise(resolve => setTimeout(resolve, ms))
				}

				const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
					state.value = StateEnum.PENDING
					await wait(1000)

					return new Promise((resolve) => {
						let items: User[] = getUsers()
						const total = items.length

						if (sortBy && sortBy.length > 0) {
							items = items.sort((a, b) => {
								const key = sortBy[0].key
								const order = sortBy[0].order === 'asc' ? 1 : -1

								return a[key] > b[key] ? order : -order
							})
						}

						if (itemsPerPage > 0) {
							items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
						}

						resolve({ items, total })
						state.value = StateEnum.RESOLVED
					})
				}

				const getUsers = (): User[] => {
					return [
						{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
						{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
						{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
						{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
						{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
						{ firstname: 'Louis', lastname: 'Denis', email: 'louis.denis@example.com' },
						{ firstname: 'Édith', lastname: 'Cartier', email: 'edith.cartier@example.com' },
						{ firstname: 'Alphonse', lastname: 'Bouvier', email: 'alphonse.bouvier@example.com' },
						{ firstname: 'Eustache', lastname: 'Dubois', email: 'eustache.dubois@example.com' },
						{ firstname: 'Rosemarie', lastname: 'Quessy', email: 'rosemarie.quessy@example.com' },
						{ firstname: 'Serge', lastname: 'Rivard', email: 'serge.rivard@example.com' },
						{ firstname: 'Jacques', lastname: 'Demers', email: 'jacques.demers@example.com' },
						{ firstname: 'Aimée', lastname: 'Josseaume', email: 'aimee.josseaume@example.com' },
						{ firstname: 'Delphine', lastname: 'Robillard', email: 'delphine.robillard@example.com' },
						{ firstname: 'Alexandre', lastname: 'Lazure', email: 'alexandre.lazure@example.com' },
					]
				}

				return { args, headers, users, options, state, fetchData, totalUsers, StateEnum }
			},
			template: `
			<div class="pa-4">
				<PaginatedTable
					v-model:options="options"
					:items="users"
					:headers="headers"
					:caption="args.caption"
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					suffix="api-example"
					@update:options="fetchData"
				/>
			</div>
			`,
		}
	},
}

export const ManyTables: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="pa-4">
						<PaginatedTable
							suffix="table1"
							:items="itemsTable1"
							caption="Liste des utilisateurs"
						/>
						<hr class="my-4">
						<PaginatedTable
							suffix="table2"
							:items="itemsTable2"
							caption="Liste des utilisateurs"
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
	import { PaginatedTable } from '@cnamts/synapse'

	const itemsTable1 = ref([
		{
			id: 1,
			lastname: 'Doe',
			firstname: 'John',
		},
		{
			id: 2,
			lastname: 'Smith',
			firstname: 'Jane',
		},
		{
			id: 3,
			lastname: 'Brown',
			firstname: 'Charlie',
		},
	])

	const itemsTable2 = ref([
		{
			id: 1,
			lastname: 'Smith',
			firstname: 'Jane',
		},
		{
			id: 2,
			lastname: 'Doe',
			firstname: 'John',
		},
		{
			id: 3,
			lastname: 'Brown',
			firstname: 'Charlie',
		},
	])
</script>
				`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 5,
			page: 1,
		},
		caption: 'Liste des utilisateurs',
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				const itemsTable1 = ref([
					{
						id: 1,
						lastname: 'Doe',
						firstname: 'John',
					},
					{
						id: 2,
						lastname: 'Smith',
						firstname: 'Jane',
					},
					{
						id: 3,
						lastname: 'Brown',
						firstname: 'Charlie',
					},
				])

				const itemsTable2 = ref([
					{
						id: 1,
						lastname: 'Smith',
						firstname: 'Jane',
					},
					{
						id: 2,
						lastname: 'Doe',
						firstname: 'John',
					},
					{
						id: 3,
						lastname: 'Brown',
						firstname: 'Charlie',
					},
				])
				return { args, itemsTable1, itemsTable2 }
			},
			template: `
			<div class="pa-4">
				<PaginatedTable
					suffix="table1"
					:items="itemsTable1"
					:caption="args.caption"
				/>
				<hr class="my-4">
				<PaginatedTable
					suffix="table2"
					:items="itemsTable2"
					:caption="args.caption"
				/>
			</div>
			`,
		}
	},
}
