import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import { StateEnum } from '../common/constants/StateEnum'
import type { DataOptions, FilterType } from '../common/types'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'
import { fn } from '@storybook/test'

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
	title: 'Composants/Tableaux/SyServerTable',
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
		headers: {
			description: 'Liste des colonnes du tableau (voir : https://vuetifyjs.com/en/api/v-data-table/#props-headers)',
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
				defaultValue: {
					summary: '[]',
				},
			},
		},
		density: {
			description: 'Définit la densité du tableau',
			control: { type: 'select' },
			options: ['default', 'comfortable', 'compact'],
			table: {
				category: 'props',
				type: { summary: 'string', detail: `'default' | 'comfortable' | 'compact'` },
			},
		},
		striped: {
			description: 'Affiche les lignes du tableau avec un fond rayé',
			control: { type: 'boolean' },
			table: {
				category: 'props',
				type: { summary: 'boolean' },
			},
		},
		options: {
			description: 'Options de configuration du tableau',
			name: 'v-model:options',
			control: { type: 'object' },
			table: {
				category: 'props',
				type: { summary: 'DataOptions', detail: '{ page: number, itemsPerPage: number, sortBy: SortOptions[], groupBy?: SortOptions[], multiSort?: boolean, mustSort?: boolean, filters?: FilterOption[] }' },
			},
		},
		serverItemsLength: {
			description: 'Nombre total d\'éléments à afficher',
			control: { type: 'number' },
		},
		suffix: {
			description: 'Suffixe permettant de gérer individuellement le stockage des options d\'un tableau d\'une page à l\'autre. Ce prop est obligatoire pour garantir un stockage unique pour chaque tableau.',
			control: { type: 'text' },
			table: {
				category: 'props',
				type: { summary: 'string' },
			},
			required: true,
		},
		itemsPerPage: {
			description: 'Nombre d\'éléments par page',
			control: { type: 'number' },
		},
		caption: {
			description: 'Texte de la légende du tableau',
			control: { type: 'text' },
		},
		resizableColumns: {
			description: 'Permet de redimensionner les colonnes du tableau',
		},
		showSelect: {
			description: 'Affiche des cases à cocher pour sélectionner des lignes',
			control: { type: 'boolean' },
			table: {
				category: 'props',
				type: { summary: 'boolean' },
			},
		},
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
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
					import { ref, watch } from 'vue'
					import { SyServerTable } from '@cnamts/synapse'
					import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
					import type { DataOptions } from '@cnamts/synapse/src/components/Tables/common/types'
					
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
		headers: [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		],
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-default',
		density: 'default',
		striped: false,
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					// @ts-expect-error - fetchData is not defined
					const { items, total } = await getDataFromApi(args.options)
					users.value = items
					totalUsers.value = total
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

				return { args, users, state, fetchData, totalUsers, StateEnum }
			},
			template: `
			<div>
				<SyServerTable
					v-model:options="args.options"
					:items="users"
					:headers="args.headers"
					:caption="args.caption"
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					:suffix="args.suffix"
					:density="args.density"
					:striped="args.striped"
					:resizable-columns="args.resizableColumns"
					@update:options="fetchData"
				/>
			</div>
			`,
		}
	},
}

export const ServerSortBy: Story = {
	parameters: {
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

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'desc' }],
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
			sortBy: [{ key: 'lastname', order: 'desc' }],
			page: 1,
		},
		headers: [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		],
		caption: '',
		serverItemsLength: 0,
		suffix: 'server-sort',
		density: 'default',
		striped: false,
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					const { items, total } = await getDataFromApi(args.options as DataOptions)
					users.value = items
					totalUsers.value = total
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
					]
				}

				return { args, users, state, fetchData, totalUsers, StateEnum }
			},
			template: `
	  <div>
		<SyServerTable
		  v-model:options="args.options"
		  :items="users"
		  :headers="args.headers"
		  :caption="args.caption"
		  :server-items-length="totalUsers"
		  :loading="state === StateEnum.PENDING"
		  :suffix="args.suffix"
		  :density="args.density"
		  :striped="args.striped"
		  :resizable-columns="args.resizableColumns"
		  @update:options="fetchData"
		/>
	  </div>
	  `,
		}
	},
}

export const ServerFilterByText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-text"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			firstname: string
			lastname: string
			email: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Prénom', 
			  key: 'firstname',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Nom', 
			  key: 'lastname',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Email', 
			  key: 'email',
			  filterable: true,
			  filterType: 'text'
			}
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
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
			  { firstname: 'Martin', lastname: 'Lavoie', email: 'martin.lavoie@example.com' },
			  { firstname: 'Céline', lastname: 'Tremblay', email: 'celine.tremblay@example.com' },
			  { firstname: 'Jacques', lastname: 'Gagnon', email: 'jacques.gagnon@example.com' },
			  { firstname: 'Isabelle', lastname: 'Côté', email: 'isabelle.cote@example.com' },
			  { firstname: 'Philippe', lastname: 'Bouchard', email: 'philippe.bouchard@example.com' },
			]
		  }
		  
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 15,
		headers: [
			{
				title: 'Prénom',
				key: 'firstname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Nom',
				key: 'lastname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Email',
				key: 'email',
				filterable: true,
				filterType: 'text',
			},
		],
		caption: '',
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		showFilters: true,
		suffix: 'server-filter-text',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref(args.options)
				const totalFilteredUsers = ref(0)
				const filteredUsers = ref<Record<string, unknown>[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					state.value = StateEnum.PENDING

					// Simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Get all users
					let items = [
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
						{ firstname: 'Martin', lastname: 'Lavoie', email: 'martin.lavoie@example.com' },
						{ firstname: 'Céline', lastname: 'Tremblay', email: 'celine.tremblay@example.com' },
						{ firstname: 'Jacques', lastname: 'Gagnon', email: 'jacques.gagnon@example.com' },
						{ firstname: 'Isabelle', lastname: 'Côté', email: 'isabelle.cote@example.com' },
						{ firstname: 'Philippe', lastname: 'Bouchard', email: 'philippe.bouchard@example.com' },
					]

					// Apply filters on server side
					if (options.value?.filters && options.value.filters.length > 0) {
						options.value.filters.forEach((filter) => {
							const { key, value } = filter

							items = items.filter((item) => {
								const itemValue = item[key]
								return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
							})
						})
					}

					const total = items.length

					// Apply pagination
					const { page = 1, itemsPerPage = 10 } = options.value || {}
					if (itemsPerPage > 0) {
						items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					}

					filteredUsers.value = items as Record<string, unknown>[]
					totalFilteredUsers.value = total
					state.value = StateEnum.RESOLVED
				}

				// Initialize data
				fetchData()

				return {
					args,
					options,
					filteredUsers,
					totalFilteredUsers,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="filteredUsers"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:resizable-columns="args.resizableColumns"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterByNumber: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-number"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			name: string
			age: number
			salary: number
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Nom', 
			  key: 'name',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Âge', 
			  key: 'age',
			  filterable: true,
			  filterType: 'number'
			},
			{ 
			  title: 'Salaire', 
			  key: 'salary',
			  filterable: true,
			  filterType: 'number'
			}
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value, type } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					
					if (type === 'number') {
					  return Number(itemValue) === Number(value)
					} else {
					  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					}
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1

				  if (typeof a[key] === 'number' && typeof b[key] === 'number') {
					return (a[key] as number) > (b[key] as number) ? order : -order
				  }
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
			  if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			  }

			  resolve({ items, total })
			  state.value = StateEnum.RESOLVED
			})
		  }

		  const getUsers = (): User[] => {
			return [
			  { name: 'Jean Dupont', age: 32, salary: 45000 },
			  { name: 'Marie Martin', age: 28, salary: 52000 },
			  { name: 'Pierre Durand', age: 45, salary: 65000 },
			  { name: 'Sophie Petit', age: 36, salary: 48000 },
			  { name: 'Thomas Leroy', age: 41, salary: 58000 },
			  { name: 'Julie Bernard', age: 29, salary: 47000 },
			  { name: 'Nicolas Moreau', age: 38, salary: 61000 },
			  { name: 'Camille Dubois', age: 33, salary: 49000 },
			  { name: 'Alexandre Lefebvre', age: 44, salary: 67000 },
			  { name: 'Émilie Girard', age: 31, salary: 51000 },
			  { name: 'Lucas Roux', age: 39, salary: 59000 },
			  { name: 'Chloé Lambert', age: 27, salary: 46000 },
			  { name: 'Maxime Simon', age: 42, salary: 63000 },
			  { name: 'Laura Fournier', age: 35, salary: 54000 },
			  { name: 'Antoine Mercier', age: 40, salary: 60000 },
			]
		  }
		  
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		headers: [
			{
				title: 'Nom',
				key: 'name',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Âge',
				key: 'age',
				filterable: true,
				filterType: 'number',
			},
			{
				title: 'Salaire',
				key: 'salary',
				filterable: true,
				filterType: 'number',
			},
		],
		caption: '',
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		serverItemsLength: 15,
		showFilters: true,
		suffix: 'server-filter-number',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref(args.options)
				const totalFilteredUsers = ref(0)
				const filteredUsers = ref<Record<string, unknown>[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					state.value = StateEnum.PENDING

					// Simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Get all users
					let items = [
						{ name: 'Jean Dupont', age: 32, salary: 45000 },
						{ name: 'Marie Martin', age: 28, salary: 52000 },
						{ name: 'Pierre Durand', age: 45, salary: 65000 },
						{ name: 'Sophie Petit', age: 36, salary: 48000 },
						{ name: 'Thomas Leroy', age: 41, salary: 58000 },
						{ name: 'Julie Bernard', age: 29, salary: 47000 },
						{ name: 'Nicolas Moreau', age: 38, salary: 61000 },
						{ name: 'Camille Dubois', age: 33, salary: 49000 },
						{ name: 'Alexandre Lefebvre', age: 44, salary: 67000 },
						{ name: 'Émilie Girard', age: 31, salary: 51000 },
						{ name: 'Lucas Roux', age: 39, salary: 59000 },
						{ name: 'Chloé Lambert', age: 27, salary: 46000 },
						{ name: 'Maxime Simon', age: 42, salary: 63000 },
						{ name: 'Laura Fournier', age: 35, salary: 54000 },
						{ name: 'Antoine Mercier', age: 40, salary: 60000 },
					]

					// Apply filters on server side
					if (options.value?.filters && options.value.filters.length > 0) {
						options.value.filters.forEach((filter) => {
							const { key, value, type } = filter

							items = items.filter((item) => {
								const itemValue = item[key]

								if (type === 'number') {
									return Number(itemValue) === Number(value)
								}
								else {
									return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
								}
							})
						})
					}

					const total = items.length

					// Apply pagination
					const { page = 1, itemsPerPage = 10 } = options.value || {}
					if (itemsPerPage > 0) {
						items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					}

					filteredUsers.value = items as Record<string, unknown>[]
					totalFilteredUsers.value = total
					state.value = StateEnum.RESOLVED
				}

				// Initialize data
				fetchData()

				return {
					args,
					options,
					filteredUsers,
					totalFilteredUsers,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="filteredUsers"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:resizable-columns="args.resizableColumns"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterBySelect: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-select"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			name: string
			department: string
			status: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Nom', 
			  key: 'name',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Département', 
			  key: 'department',
			  filterable: true,
			  filterType: 'select',
			  hideMessages: true,
			  filterOptions: [
				{ text: 'RH', value: 'RH' },
				{ text: 'IT', value: 'IT' },
				{ text: 'Finance', value: 'Finance' },
				{ text: 'Marketing', value: 'Marketing' },
			  ]
			},
			{ 
			  title: 'Statut', 
			  key: 'status',
			  filterable: true,
			  filterType: 'select',
			  hideMessages: true,
			  filterOptions: [
				{ text: 'Actif', value: 'Actif' },
				{ text: 'En congé', value: 'En congé' },
				{ text: 'Inactif', value: 'Inactif' },
			  ]
			}
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value, type } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					
					if (type === 'select') {
					  return itemValue === value
					} else {
					  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					}
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
			  if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			  }

			  resolve({ items, total })
			  state.value = StateEnum.RESOLVED
			})
		  }

		  const getUsers = (): User[] => {
			return [
			  { name: 'Jean Dupont', department: 'RH', status: 'Actif' },
			  { name: 'Marie Martin', department: 'IT', status: 'En congé' },
			  { name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
			  { name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
			  { name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
			  { name: 'Julie Bernard', department: 'RH', status: 'Actif' },
			  { name: 'Nicolas Moreau', department: 'Finance', status: 'En congé' },
			  { name: 'Camille Dubois', department: 'Marketing', status: 'Inactif' },
			  { name: 'Alexandre Lefebvre', department: 'IT', status: 'Actif' },
			  { name: 'Émilie Girard', department: 'RH', status: 'En congé' },
			  { name: 'Lucas Roux', department: 'Finance', status: 'Actif' },
			  { name: 'Chloé Lambert', department: 'Marketing', status: 'Actif' },
			  { name: 'Maxime Simon', department: 'IT', status: 'Inactif' },
			  { name: 'Laura Fournier', department: 'RH', status: 'Actif' },
			  { name: 'Antoine Mercier', department: 'Finance', status: 'En congé' },
			]
		  }
		  
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		headers: [
			{
				title: 'Nom',
				key: 'name',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Département',
				key: 'department',
				filterable: true,
				filterType: 'select',
				hideMessages: true,
				filterOptions: [
					{ text: 'RH', value: 'RH' },
					{ text: 'IT', value: 'IT' },
					{ text: 'Finance', value: 'Finance' },
					{ text: 'Marketing', value: 'Marketing' },
				],
			},
			{
				title: 'Statut',
				key: 'status',
				filterable: true,
				filterType: 'select',
				hideMessages: true,
				filterOptions: [
					{ text: 'Actif', value: 'Actif' },
					{ text: 'En congé', value: 'En congé' },
					{ text: 'Inactif', value: 'Inactif' },
				],
			},
		],
		caption: '',
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		serverItemsLength: 15,
		showFilters: true,
		suffix: 'server-filter-select',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref(args.options)
				const totalFilteredUsers = ref(0)
				const filteredUsers = ref<Record<string, unknown>[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					state.value = StateEnum.PENDING

					// Simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Get all users
					let items = [
						{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
						{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
						{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
						{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
						{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
						{ name: 'Julie Bernard', department: 'RH', status: 'Actif' },
						{ name: 'Nicolas Moreau', department: 'Finance', status: 'En congé' },
						{ name: 'Camille Dubois', department: 'Marketing', status: 'Inactif' },
						{ name: 'Alexandre Lefebvre', department: 'IT', status: 'Actif' },
						{ name: 'Émilie Girard', department: 'RH', status: 'En congé' },
						{ name: 'Lucas Roux', department: 'Finance', status: 'Actif' },
						{ name: 'Chloé Lambert', department: 'Marketing', status: 'Actif' },
						{ name: 'Maxime Simon', department: 'IT', status: 'Inactif' },
						{ name: 'Laura Fournier', department: 'RH', status: 'Actif' },
						{ name: 'Antoine Mercier', department: 'Finance', status: 'En congé' },
					]

					// Apply filters on server side
					if (options.value?.filters && options.value.filters.length > 0) {
						options.value.filters.forEach((filter) => {
							const { key, value, type } = filter

							items = items.filter((item) => {
								const itemValue = item[key]

								if (type === 'select') {
									return itemValue === value
								}
								else {
									return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
								}
							})
						})
					}

					const total = items.length

					// Apply pagination
					const { page = 1, itemsPerPage = 10 } = options.value || {}
					if (itemsPerPage > 0) {
						items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					}

					filteredUsers.value = items as Record<string, unknown>[]
					totalFilteredUsers.value = total
					state.value = StateEnum.RESOLVED
				}

				// Initialize data
				fetchData()

				return {
					args,
					options,
					filteredUsers,
					totalFilteredUsers,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="filteredUsers"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:resizable-columns="args.resizableColumns"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterBySelectMultiple: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-select"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			name: string
			department: string
			status: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Nom', 
			  key: 'name',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Département', 
			  key: 'department',
			  filterable: true,
			  filterType: 'select',
			  multiple: true,
			  chips: true,
			  hideMessages: true,
			  filterOptions: [
				{ text: 'RH', value: 'RH' },
				{ text: 'IT', value: 'IT' },
				{ text: 'Finance', value: 'Finance' },
				{ text: 'Marketing', value: 'Marketing' },
			  ]
			},
			{ 
			  title: 'Statut', 
			  key: 'status',
			  filterable: true,
			  filterType: 'select',
			  multiple: true,
			  chips: true,
			  hideMessages: true,
			  filterOptions: [
				{ text: 'Actif', value: 'Actif' },
				{ text: 'En congé', value: 'En congé' },
				{ text: 'Inactif', value: 'Inactif' },
			  ]
			}
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value, type } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					
					if (type === 'select') {
					  return itemValue === value
					} else {
					  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					}
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
			  if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			  }

			  resolve({ items, total })
			  state.value = StateEnum.RESOLVED
			})
		  }

		  const getUsers = (): User[] => {
			return [
			  { name: 'Jean Dupont', department: 'RH', status: 'Actif' },
			  { name: 'Marie Martin', department: 'IT', status: 'En congé' },
			  { name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
			  { name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
			  { name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
			  { name: 'Julie Bernard', department: 'RH', status: 'Actif' },
			  { name: 'Nicolas Moreau', department: 'Finance', status: 'En congé' },
			  { name: 'Camille Dubois', department: 'Marketing', status: 'Inactif' },
			  { name: 'Alexandre Lefebvre', department: 'IT', status: 'Actif' },
			  { name: 'Émilie Girard', department: 'RH', status: 'En congé' },
			  { name: 'Lucas Roux', department: 'Finance', status: 'Actif' },
			  { name: 'Chloé Lambert', department: 'Marketing', status: 'Actif' },
			  { name: 'Maxime Simon', department: 'IT', status: 'Inactif' },
			  { name: 'Laura Fournier', department: 'RH', status: 'Actif' },
			  { name: 'Antoine Mercier', department: 'Finance', status: 'En congé' },
			]
		  }
		  
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		headers: [
			{
				title: 'Nom',
				key: 'name',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Département',
				key: 'department',
				filterable: true,
				filterType: 'select',
				multiple: true,
				chips: true,
				hideMessages: true,
				filterOptions: [
					{ text: 'RH', value: 'RH' },
					{ text: 'IT', value: 'IT' },
					{ text: 'Finance', value: 'Finance' },
					{ text: 'Marketing', value: 'Marketing' },
				],
			},
			{
				title: 'Statut',
				key: 'status',
				filterable: true,
				filterType: 'select',
				multiple: true,
				chips: true,
				hideMessages: true,
				filterOptions: [
					{ text: 'Actif', value: 'Actif' },
					{ text: 'En congé', value: 'En congé' },
					{ text: 'Inactif', value: 'Inactif' },
				],
			},
		],
		caption: '',
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		serverItemsLength: 15,
		showFilters: true,
		suffix: 'server-filter-select',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref(args.options)
				const totalFilteredUsers = ref(0)
				const filteredUsers = ref<Record<string, unknown>[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					state.value = StateEnum.PENDING

					// Simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Get all users
					let items = [
						{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
						{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
						{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
						{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
						{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
						{ name: 'Julie Bernard', department: 'RH', status: 'Actif' },
						{ name: 'Nicolas Moreau', department: 'Finance', status: 'En congé' },
						{ name: 'Camille Dubois', department: 'Marketing', status: 'Inactif' },
						{ name: 'Alexandre Lefebvre', department: 'IT', status: 'Actif' },
						{ name: 'Émilie Girard', department: 'RH', status: 'En congé' },
						{ name: 'Lucas Roux', department: 'Finance', status: 'Actif' },
						{ name: 'Chloé Lambert', department: 'Marketing', status: 'Actif' },
						{ name: 'Maxime Simon', department: 'IT', status: 'Inactif' },
						{ name: 'Laura Fournier', department: 'RH', status: 'Actif' },
						{ name: 'Antoine Mercier', department: 'Finance', status: 'En congé' },
					]

					// Apply filters on server side
					if (options.value?.filters && options.value.filters.length > 0) {
						options.value.filters.forEach((filter) => {
							const { key, value, type } = filter

							items = items.filter((item) => {
								const itemValue = item[key]

								if (type === 'select') {
									if (Array.isArray(value)) {
										// Empty array means no filter applied
										if (value.length === 0) return true
										// Check if item value is in the selected values
										return value.includes(itemValue)
									}
									else {
										return itemValue === value
									}
								}
								else {
									return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
								}
							})
						})
					}

					const total = items.length

					// Apply pagination
					const { page = 1, itemsPerPage = 10 } = options.value || {}
					if (itemsPerPage > 0) {
						items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					}

					filteredUsers.value = items as Record<string, unknown>[]
					totalFilteredUsers.value = total
					state.value = StateEnum.RESOLVED
				}

				// Initialize data
				fetchData()

				return {
					args,
					options,
					filteredUsers,
					totalFilteredUsers,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="filteredUsers"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:resizable-columns="args.resizableColumns"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterByExacteDate: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-date"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			name: string
			hireDate: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Nom', 
			  key: 'name',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Date d'embauche', 
			  key: 'hireDate',
			  filterable: true,
			  filterType: 'date',
			  dateFormat: 'DD/MM/YYYY'
			},
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value, type } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					
					if (type === 'date') {
					  // Simple date comparison for demo purposes
					  return itemValue === value
					} else {
					  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					}
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
			  if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			  }

			  resolve({ items, total })
			  state.value = StateEnum.RESOLVED
			})
		  })
		}
		
		// Update the displayed data
		users.value = filteredData
		totalUsers.value = filteredData.length

		state.value = StateEnum.RESOLVED
	  }
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 0,
		showFilters: true,
		headers: [
			{
				title: 'Nom',
				key: 'name',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Date d\'embauche',
				key: 'hireDate',
				filterable: true,
				filterType: 'date',
				dateFormat: 'DD/MM/YYYY',
			},
		],
		caption: '',
		suffix: 'server-filter-date',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				// Original data that never changes
				const originalUsers = [
					{
						name: 'Jean-Pierre Dubois',
						hireDate: dayjs('2025-05-15').format('DD/MM/YYYY'),
					},
					{
						name: 'Marie-Claire Lefèvre',
						hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
					},
					{
						name: 'François Moreau',
						hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
					},
					{
						name: 'Céline Rousseau',
						hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
					},
					{
						name: 'Thierry Bertrand',
						hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
					},
				]

				const totalUsers = ref(originalUsers.length)
				const users = ref([...originalUsers])
				const options = ref({
					itemsPerPage: 5,
					page: 1,
					filters: [],
				})
				const state = ref(StateEnum.IDLE)

				const fetchData = async () => {
					state.value = StateEnum.PENDING

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Start with original data
					let filteredData = [...originalUsers]

					// Apply filters if any
					if (options.value.filters && options.value.filters.length > 0) {
						filteredData = filteredData.filter((user) => {
							return options.value.filters!.every((filter) => {
								const { key, value, type } = filter
								const itemValue = user[key as keyof typeof user]

								if (!value) return true

								if (type === 'date') {
									// Simple date comparison for demo purposes
									return itemValue === value
								}
								else if (type === 'period') {
									const filter = value as { from: string, to: string }
									const start = new Date(filter.from)
									const end = new Date(filter.to)
									const itemDate = new Date(itemValue)

									if (itemDate) {
										if (end && itemDate < end) {
											return false
										}
										if (start && itemDate > start) {
											return false
										}
									}

									return true
								}
								else {
									return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
								}
							})
						})
					}

					// Update the displayed data
					users.value = filteredData
					totalUsers.value = filteredData.length

					state.value = StateEnum.RESOLVED
				}

				return {
					args,
					users,
					totalUsers,
					options,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="users"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						:resizable-columns="args.resizableColumns"
						:show-filters="true"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterByPeriod: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-date"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			name: string
			hireDate: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Nom', 
			  key: 'name',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Date d'embauche', 
			  key: 'hireDate',
			  filterable: true,
			  filterType: 'periode',
			  dateFormat: 'DD/MM/YYYY'
			},
		  ]

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value, type } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					
					if (type === 'period') {
						function formatDate(date: string): Date | null {
							if (!date) return null
							const parsedDate = dayjs(date, 'DD/MM/YYYY')
							return parsedDate.isValid() ? parsedDate.toDate() : null
						}
						const filter = value as { from: string, to: string }
						const start = formatDate(filter.from)
						const end = formatDate(filter.to)
						const itemDate = formatDate(itemValue)

						if (itemDate) {
							if (end && itemDate > end) {
								return false
							}
							if (start && itemDate < start) {
								return false
							}
						}
						return true
					} else {
					  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					}
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
			  if (itemsPerPage > 0) {
				items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
			  }

			  resolve({ items, total })
			  state.value = StateEnum.RESOLVED
			})
		  })
		}
		
		// Update the displayed data
		users.value = filteredData
		totalUsers.value = filteredData.length

		state.value = StateEnum.RESOLVED
	  }
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 0,
		showFilters: true,
		headers: [
			{
				title: 'Nom',
				key: 'name',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Date d\'embauche',
				key: 'hireDate',
				filterable: true,
				filterType: 'period',
				dateFormat: 'DD/MM/YYYY',
			},
		],
		caption: '',
		suffix: 'server-filter-date',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				// Original data that never changes
				const originalUsers = [
					{
						name: 'Jean-Pierre Dubois',
						hireDate: dayjs('2025-05-15').format('DD/MM/YYYY'),
					},
					{
						name: 'Marie-Claire Lefèvre',
						hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
					},
					{
						name: 'François Moreau',
						hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
					},
					{
						name: 'Céline Rousseau',
						hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
					},
					{
						name: 'Thierry Bertrand',
						hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
					},
				]

				const totalUsers = ref(originalUsers.length)
				const users = ref([...originalUsers])
				const options = ref({
					itemsPerPage: 5,
					page: 1,
					filters: [],
				})
				const state = ref(StateEnum.IDLE)

				const fetchData = async () => {
					state.value = StateEnum.PENDING

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Start with original data
					let filteredData = [...originalUsers]

					// Apply filters if any
					if (options.value.filters && options.value.filters.length > 0) {
						filteredData = filteredData.filter((user) => {
							return options.value.filters!.every((filter) => {
								const { key, value, type } = filter
								const itemValue = user[key as keyof typeof user]

								if (!value) return true

								else if (type === 'period') {
									function formatDate(date: string): Date | null {
										if (!date) return null
										const parsedDate = dayjs(date, 'DD/MM/YYYY')
										return parsedDate.isValid() ? parsedDate.toDate() : null
									}
									const filter = value as { from: string, to: string }
									const start = formatDate(filter.from)
									const end = formatDate(filter.to)
									const itemDate = formatDate(itemValue)

									if (itemDate) {
										if (end && itemDate > end) {
											return false
										}
										if (start && itemDate < start) {
											return false
										}
									}
									return true
								}
								else {
									return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
								}
							})
						})
					}

					// Update the displayed data
					users.value = filteredData
					totalUsers.value = filteredData.length

					state.value = StateEnum.RESOLVED
				}

				return {
					args,
					users,
					totalUsers,
					options,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="users"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						:resizable-columns="args.resizableColumns"
						:show-filters="true"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const CustomFilterSlot: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyServerTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						:server-items-length="serverItemsLength"
						:loading="loading"
						show-filters
						suffix="server-custom-filter-slot"
						@update:options="fetchData"
					>
						<template #filter.custom="{ header, value, updateFilter }">
							<div class="custom-filter-container">
								<div class="custom-filter-info mb-2">
									Filtre personnalisé :
								</div>
								<v-select
									v-model="customFilterValue"
									:items="statusOptions"
									label="Statut"
									variant="outlined"
									density="compact"
									color="primary"
									bg-color="white"
									@update:model-value="(val) => {
										// Utiliser la fonction updateFilter fournie par le slot
										updateFilter(val)
									}"
								/>
							</div>
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
					import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'
					
					const options = ref<Partial<DataOptions>>({
						itemsPerPage: 4,
						filters: []
					})
					
					const customFilterValue = ref('')
					const statusOptions = ['Actif', 'Inactif', 'En attente']
					const loading = ref(false)
					const serverItemsLength = ref(6)
					
					const headers = [
						{
							title: 'Nom',
							key: 'lastname',
							filterable: true,
							filterType: 'text'
						},
						{
							title: 'Prénom',
							key: 'firstname',
							filterable: true,
							filterType: 'text'
						},
						{
							title: 'Statut',
							key: 'status',
							filterable: true,
							filterType: 'custom' // Utilisation du type 'custom' pour activer le slot personnalisé
						},
					]
					
					const allItems = [
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							status: 'Actif',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							status: 'Inactif',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							status: 'En attente',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							status: 'Actif',
						},
						{
							firstname: 'Bernadette',
							lastname: 'Langelier',
							status: 'Inactif',
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							status: 'En attente',
						},
					]
					
					const items = ref(allItems)
					
					// Fonction pour simuler une requête API avec filtrage côté serveur
					const fetchData = async () => {
						loading.value = true
						
						// Simuler un délai réseau
						await new Promise(resolve => setTimeout(resolve, 300))
						
						// Récupérer les filtres
						const filters = options.value.filters || []
						
						// Filtrer les éléments côté "serveur"
						let filteredItems = [...allItems]
						
						for (const filter of filters) {
							if (filter.type === 'text') {
								filteredItems = filteredItems.filter(item => 
									String(item[filter.key]).toLowerCase().includes(String(filter.value).toLowerCase())
								)
							} else if (filter.type === 'select' || filter.type === 'custom') {
								// Traiter les filtres de type 'select' et 'custom' de la même manière
								filteredItems = filteredItems.filter(item => 
									item[filter.key] === filter.value
								)
							}
						}
						
						// Mettre à jour le nombre total d'éléments
						serverItemsLength.value = filteredItems.length
						
						// Appliquer la pagination
						const page = options.value.page || 1
						const itemsPerPage = options.value.itemsPerPage || 4
						const start = (page - 1) * itemsPerPage
						const end = start + itemsPerPage
						
						items.value = filteredItems.slice(start, end)
						loading.value = false
					}
					
					// Charger les données initiales
					fetchData()
				</script>
				`,
			},
			{
				name: 'Style',
				code: `
				<style scoped>
					.custom-filter-container {
						display: flex;
						flex-direction: column;
						gap: 4px;
					}
					
					.custom-filter-info {
						font-size: 12px;
						color: #666;
						margin-top: 4px;
					}
				</style>
				`,
			},
		],
	},
	args: {
		serverItemsLength: 6,
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Prénom',
				key: 'firstname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Statut',
				key: 'status',
				filterable: true,
				filterType: 'custom' as FilterType,
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				status: 'Actif',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				status: 'Inactif',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				status: 'En attente',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				status: 'Actif',
			},
			{
				firstname: 'Bernadette',
				lastname: 'Langelier',
				status: 'Inactif',
			},
			{
				firstname: 'Agate',
				lastname: 'Roy',
				status: 'En attente',
			},
		],
		caption: '',
		options: {
			itemsPerPage: 4,
			filters: [],
		},
		showFilters: true,
		suffix: 'server-custom-filter-slot',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				// Create reactive references
				const options = ref(args.options)
				const items = ref(args.items)
				const customFilterValue = ref('')
				const statusOptions = ['Actif', 'Inactif', 'En attente']
				const loading = ref(false)
				const serverItemsLength = ref(args.serverItemsLength)

				// Fonction pour simuler une requête API avec filtrage côté serveur
				const fetchData = async () => {
					loading.value = true

					// Simuler un délai réseau
					await new Promise(resolve => setTimeout(resolve, 300))

					// Récupérer les filtres
					const filters = options.value?.filters || []

					// Filtrer les éléments côté "serveur"
					let filteredItems = [...(args.items || [])]

					for (const filter of filters) {
						if (filter.type === 'text') {
							filteredItems = filteredItems.filter(item =>
								String(item[filter.key]).toLowerCase().includes(String(filter.value).toLowerCase()),
							)
						}
						else if (filter.type === 'select' || filter.type === 'custom') {
							// Traiter les filtres de type 'select' et 'custom' de la même manière
							filteredItems = filteredItems.filter(item =>
								item[filter.key] === filter.value,
							)
						}
					}

					// Mettre à jour le nombre total d'éléments
					serverItemsLength.value = filteredItems.length

					// Appliquer la pagination
					const page = options.value?.page || 1
					const itemsPerPage = options.value?.itemsPerPage || 4
					const start = (page - 1) * itemsPerPage
					const end = start + itemsPerPage

					items.value = filteredItems.slice(start, end)
					loading.value = false
				}

				return {
					args,
					options,
					items,
					customFilterValue,
					statusOptions,
					loading,
					serverItemsLength,
					fetchData,
				}
			},
			template: `
				<SyServerTable
					v-model:options="options"
					:headers="args.headers"
					:items="items"
					:caption="args.caption"
					:server-items-length="serverItemsLength"
					:loading="loading"
					:show-filters="args.showFilters"
					:suffix="args.suffix"
					:density="args.density"
					:striped="args.striped"
					:resizable-columns="args.resizableColumns"
					@update:options="fetchData"
				>
					<template #filter.custom="{ header, value, updateFilter }">
						<div class="custom-filter-container">
							<div class="custom-filter-info mb-2">
								Filtre personnalisé :
							</div>
							<v-select
								v-model="customFilterValue"
								:items="statusOptions"
								label="Statut"
								variant="outlined"
								density="compact"
								color="primary"
								bg-color="white"
								@update:model-value="(val) => {
									// Utiliser la fonction updateFilter fournie par le slot
									updateFilter(val)
								}"
							/>
						</div>
					</template>
				</SyServerTable>
			`,
		}
	},
}

export const CustomFilterInputs: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <SyServerTable
			v-model:options="options"
			:items="filteredUsers"
			:headers="headers"
			:server-items-length="totalFilteredUsers"
			:filter-input-config="filterInputConfig"
			:loading="state === StateEnum.PENDING"
			suffix="server-filter-text"
			:show-filters="true"
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
		  import type { DataOptions, FilterOption } from '@cnamts/synapse/src/components/Tables/common/types'

		  interface User {
			firstname: string
			lastname: string
			email: string
		  }

		  interface DataObj {
			items: User[]
			total: number
		  }

		  const totalFilteredUsers = ref(0)
		  const filteredUsers = ref<User[]>([])
		  const state = ref(StateEnum.IDLE)

		  const options = ref<DataOptions>({
			itemsPerPage: 5,
			page: 1,
			filters: [],
		  })

		  const headers = [
			{ 
			  title: 'Prénom', 
			  key: 'firstname',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Nom', 
			  key: 'lastname',
			  filterable: true,
			  filterType: 'text'
			},
			{ 
			  title: 'Email', 
			  key: 'email',
			  filterable: true,
			  filterType: 'text'
			}
		  ]
		  
		  const filterInputConfig = {
			filterInputConfig: {
			variant: 'outlined',
			density: 'comfortable',
			hideDetails: true,
			clearable: false,
			disableErrorHandling: true,
			},
		  }

		  const fetchData = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(options.value)
			filteredUsers.value = items
			totalFilteredUsers.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
			state.value = StateEnum.PENDING
			await wait(1000)

			return new Promise((resolve) => {
			  // Get all users
			  let items: User[] = getUsers()
			  
			  // Apply filters on server side
			  if (filters && filters.length > 0) {
				filters.forEach((filter: FilterOption) => {
				  const { key, value } = filter
				  
				  items = items.filter(item => {
					const itemValue = item[key as keyof User]
					return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
				  })
				})
			  }
			  
			  const total = items.length

			  // Apply sorting
			  if (sortBy && sortBy.length > 0) {
				items = items.sort((a, b) => {
				  const key = sortBy[0].key as keyof User
				  const order = sortBy[0].order === 'asc' ? 1 : -1
				  
				  return String(a[key]) > String(b[key]) ? order : -order
				})
			  }

			  // Apply pagination
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
			  { firstname: 'Martin', lastname: 'Lavoie', email: 'martin.lavoie@example.com' },
			  { firstname: 'Céline', lastname: 'Tremblay', email: 'celine.tremblay@example.com' },
			  { firstname: 'Jacques', lastname: 'Gagnon', email: 'jacques.gagnon@example.com' },
			  { firstname: 'Isabelle', lastname: 'Côté', email: 'isabelle.cote@example.com' },
			  { firstname: 'Philippe', lastname: 'Bouchard', email: 'philippe.bouchard@example.com' },
			]
		  }
		  
		  // Initialize data
		  fetchData()
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 15,
		headers: [
			{
				title: 'Prénom',
				key: 'firstname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Nom',
				key: 'lastname',
				filterable: true,
				filterType: 'text',
			},
			{
				title: 'Email',
				key: 'email',
				filterable: true,
				filterType: 'text',
			},
		],
		caption: '',
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		filterInputConfig: {
			variant: 'outlined',
			density: 'comfortable',
			hideDetails: true,
			clearable: false,
			disableErrorHandling: true,
		},
		showFilters: true,
		suffix: 'server-filter-text',
		density: 'default',
		striped: false,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref(args.options)
				const totalFilteredUsers = ref(0)
				const filteredUsers = ref<Record<string, unknown>[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					state.value = StateEnum.PENDING

					// Simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Get all users
					let items = [
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
						{ firstname: 'Martin', lastname: 'Lavoie', email: 'martin.lavoie@example.com' },
						{ firstname: 'Céline', lastname: 'Tremblay', email: 'celine.tremblay@example.com' },
						{ firstname: 'Jacques', lastname: 'Gagnon', email: 'jacques.gagnon@example.com' },
						{ firstname: 'Isabelle', lastname: 'Côté', email: 'isabelle.cote@example.com' },
						{ firstname: 'Philippe', lastname: 'Bouchard', email: 'philippe.bouchard@example.com' },
					]

					// Apply filters on server side
					if (options.value?.filters && options.value.filters.length > 0) {
						options.value.filters.forEach((filter) => {
							const { key, value } = filter

							items = items.filter((item) => {
								const itemValue = item[key]
								return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
							})
						})
					}

					const total = items.length

					// Apply pagination
					const { page = 1, itemsPerPage = 10 } = options.value || {}
					if (itemsPerPage > 0) {
						items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					}

					filteredUsers.value = items as Record<string, unknown>[]
					totalFilteredUsers.value = total
					state.value = StateEnum.RESOLVED
				}

				// Initialize data
				fetchData()

				return {
					args,
					options,
					filteredUsers,
					totalFilteredUsers,
					state,
					fetchData,
					StateEnum,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options"
						:items="filteredUsers"
						:headers="args.headers"
						:caption="args.caption"
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:filter-input-config="args.filterInputConfig"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:resizable-columns="args.resizableColumns"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ManyServerTables: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<template>
		  <div>
			<SyServerTable
			  v-model:options="optionsTable1"
			  :items="usersTable1"
			  :headers="headers"
			  :server-items-length="totalUsersTable1"
			  :loading="stateTable1 === StateEnum.PENDING"
			  suffix="table1"
			  @update:options="fetchDataTable1"
			/>
			<SyServerTable
			  v-model:options="optionsTable2"
			  :items="usersTable2"
			  :headers="headers"
			  :server-items-length="totalUsersTable2"
			  :loading="stateTable2 === StateEnum.PENDING"
			  suffix="table2"
			  @update:options="fetchDataTable2"
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

		  const headers = [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		  ]

		  // Table 1
		  const totalUsersTable1 = ref(0)
		  const usersTable1 = ref<User[]>([])
		  const stateTable1 = ref(StateEnum.IDLE)
		  const optionsTable1 = ref<DataOptions>({
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'asc' }],
			page: 1,
		  })

		  const fetchDataTable1 = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(optionsTable1.value)
			usersTable1.value = items
			totalUsersTable1.value = total
		  }

		  // Table 2
		  const totalUsersTable2 = ref(0)
		  const usersTable2 = ref<User[]>([])
		  const stateTable2 = ref(StateEnum.IDLE)
		  const optionsTable2 = ref<DataOptions>({
			itemsPerPage: 3,
			sortBy: [{ key: 'firstname', order: 'asc' }],
			page: 1,
		  })

		  const fetchDataTable2 = async (): Promise<void> => {
			const { items, total } = await getDataFromApi(optionsTable2.value)
			usersTable2.value = items
			totalUsersTable2.value = total
		  }

		  const wait = async (ms: number) => {
			return new Promise(resolve => setTimeout(resolve, ms))
		  }

		  const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
			const state = sortBy[0].key === 'lastname' ? stateTable1 : stateTable2
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
			]
		  }
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 15,
		headers: [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		],
		caption: '',
		suffix: 'multi',
		density: 'default',
		striped: false,
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				// Table 1
				const totalUsersTable1 = ref(0)
				const usersTable1 = ref<User[]>([])
				const stateTable1 = ref(StateEnum.IDLE)

				const optionsTable1 = ref<Partial<DataOptions>>({
					itemsPerPage: 5,
					sortBy: [{ key: 'lastname', order: 'asc' }],
					page: 1,
				})

				const fetchDataTable1 = async (): Promise<void> => {
					const { items, total } = await getDataFromApi(optionsTable1.value as DataOptions)
					usersTable1.value = items
					totalUsersTable1.value = total
				}

				// Table 2
				const totalUsersTable2 = ref(0)
				const usersTable2 = ref<User[]>([])
				const stateTable2 = ref(StateEnum.IDLE)

				const optionsTable2 = ref<Partial<DataOptions>>({
					itemsPerPage: 3,
					sortBy: [{ key: 'firstname', order: 'asc' }],
					page: 1,
				})

				const fetchDataTable2 = async (): Promise<void> => {
					const { items, total } = await getDataFromApi(optionsTable2.value as DataOptions)
					usersTable2.value = items
					totalUsersTable2.value = total
				}

				const wait = async (ms: number) => {
					return new Promise(resolve => setTimeout(resolve, ms))
				}

				const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
					const state = sortBy[0].key === 'lastname' ? stateTable1 : stateTable2
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
					]
				}

				return {
					args,
					usersTable1,
					totalUsersTable1,
					optionsTable1,
					stateTable1,
					fetchDataTable1,
					usersTable2,
					totalUsersTable2,
					optionsTable2,
					stateTable2,
					fetchDataTable2,
					StateEnum,
				}
			},
			template: `
	  <div>
		<SyServerTable
		  v-model:options="optionsTable1"
		  :items="usersTable1"
		  :headers="args.headers"
		  :caption="args.caption"
		  :server-items-length="totalUsersTable1"
		  :loading="stateTable1 === StateEnum.PENDING"
		  :density="args.density"
		  :striped="args.striped"
		  suffix="table1"
		  class="mb-10"
		  :resizable-columns="args.resizableColumns"
		  @update:options="fetchDataTable1"
		/>
		<SyServerTable
		  v-model:options="optionsTable2"
		  :items="usersTable2"
		  :headers="args.headers"
		  :caption="args.caption"
		  :server-items-length="totalUsersTable2"
		  :loading="stateTable2 === StateEnum.PENDING"
		  :density="args.density"
		  :striped="args.striped"
		  suffix="table2"
		  :resizable-columns="args.resizableColumns"
		  @update:options="fetchDataTable2"
		/>
	  </div>
	  `,
		}
	},
}

export const DataAlignment: Story = {
	parameters: {
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
					import { ref, watch } from 'vue'
					import { SyServerTable } from '@cnamts/synapse'
					import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
					import type { DataOptions } from '@cnamts/synapse/src/components/Tables/common/types'

					const totalUsers = ref(0)
					const users = ref<User[]>([])
					const state = ref(StateEnum.IDLE)
				
					const options = ref({
						itemsPerPage: 5,
						sortBy: [{ key: 'lastname', order: 'asc' }],
						page: 1,
					})
				
					const headers = [
						{
							title: 'ID',
							key: 'id',
							align: 'center',
						},
						{
							title: 'Nom',
							key: 'lastname',
							align: 'start',
						},
						{
							title: 'Date de naissance',
							key: 'birthdate',
							align: 'center',
						},
						{
							title: 'NIR',
							key: 'nir',
							align: 'end',
						},
					]
				
					const fetchData = async (): Promise<void> => {
						const { items, total } = await getDataFromApi(options.value)
						users.value = items
						totalUsers.value = total
					}
				
					const wait = async (ms: number) => {
						return new Promise(resolve => setTimeout(resolve, ms))
					}
				
					const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions) => {
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
				
					const getUsers = () => {
						return [
							{
								id: '1',
								lastname: 'Lefebvre',
								birthdate: '18/02/1989',
								nir: '1 89 02 75 120 005 79',
							},
							{
								id: '2',
								lastname: 'Richard',
								birthdate: '22/05/1991',
								nir: '2 91 05 75 120 005 76',
							},
							{
								id: '3',
								lastname: 'Fournier',
								birthdate: '11/11/2000',
								nir: '2 00 11 42 120 008 87',
							},
						]
					}
				</script>
				`,
			},
		],
	},
	args: {
		'options': {
			itemsPerPage: 5,
			sortBy: [{ key: 'lastname', order: 'asc' }],
			page: 1,
		},
		'headers': [
			{
				title: 'ID',
				key: 'id',
				align: 'center',
			},
			{
				title: 'Nom',
				key: 'lastname',
				align: 'start',
			},
			{
				title: 'Date de naissance',
				key: 'birthdate',
				align: 'center',
			},
			{
				title: 'NIR',
				key: 'nir',
				align: 'end',
			},
		],
		'caption': '',
		'serverItemsLength': 15,
		'suffix': 'server-resizable-columns',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					// @ts-expect-error - fetchData is not defined
					const { items, total } = await getDataFromApi(args.options)
					users.value = items
					totalUsers.value = total
				}

				const wait = async (ms: number) => {
					return new Promise(resolve => setTimeout(resolve, ms))
				}

				const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions) => {
					state.value = StateEnum.PENDING
					await wait(1000)

					return new Promise((resolve) => {
						let items = getUsers()
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

				const getUsers = () => {
					return [
						{
							id: '1',
							lastname: 'Lefebvre',
							birthdate: '18/02/1989',
							nir: '1 89 02 75 120 005 79',
						},
						{
							id: '2',
							lastname: 'Richard',
							birthdate: '22/05/1991',
							nir: '2 91 05 75 120 005 76',
						},
						{
							id: '3',
							lastname: 'Fournier',
							birthdate: '11/11/2000',
							nir: '2 00 11 42 120 008 87',
						},
					]
				}

				return { args, users, state, fetchData, totalUsers, StateEnum }
			},
			template: `
				<SyServerTable
					v-model:options="args.options"
					:items="users"
					:headers="args.headers"
					:caption="args.caption"
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					:suffix="args.suffix"
					:density="args.density"
					:striped="args.striped"
					@update:options="[fetchData, args['onUpdate:options']]"
				/>
			`,
		}
	},
}

export const ResizableColumns: Story = {
	parameters: {
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
					import { ref, watch } from 'vue'
					import { SyServerTable } from '@cnamts/synapse'
					import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
					import type { DataOptions } from '@cnamts/synapse/src/components/Tables/common/types'
					
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
		headers: [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		],
		caption: '',
		serverItemsLength: 15,
		suffix: 'server-resizable-columns',
		density: 'default',
		striped: false,
		resizableColumns: true,
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
				const state = ref(StateEnum.IDLE)

				const fetchData = async (): Promise<void> => {
					// @ts-expect-error - fetchData is not defined
					const { items, total } = await getDataFromApi(args.options)
					users.value = items
					totalUsers.value = total
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

				return { args, users, state, fetchData, totalUsers, StateEnum }
			},
			template: `
			<div>
				<SyServerTable
					v-model:options="args.options"
					:items="users"
					:headers="args.headers"
					:caption="args.caption"
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					:suffix="args.suffix"
					:density="args.density"
					:striped="args.striped"
					:resizable-columns="args.resizableColumns"
					@update:options="fetchData"
				/>
			</div>
			`,
		}
	},
}
export const RowSelection: Story = {
	name: 'Row Selection',
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyServerTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						:serverItemsLength="items.length"
						show-select
						show-filters
						suffix="selection-server-table"
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
		options: {
			itemsPerPage: 4,
		},
		caption: '',
		suffix: 'selection-server-table',
		density: 'default',
		striped: false,
		showSelect: true,
		showFilters: true,
		serverItemsLength: 6,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const selection = ref([])
				return { args, selection }
			},
			template: `
				<div style="padding: 20px;">
					<SyServerTable
						v-model:options="args.options"
						v-model="selection"
						:headers="args.headers"
						:items="args.items"
						:server-items-length="args.serverItemsLength"
						:show-select="args.showSelect"
						:suffix="args.suffix"
						:density="args.density"
						:striped="args.striped"
						:show-filters="args.showFilters"
					/>
					<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
						<strong>Selected items:</strong> {{ selection.length }}
					</div>
				</div>
			`,
		}
	},
}
