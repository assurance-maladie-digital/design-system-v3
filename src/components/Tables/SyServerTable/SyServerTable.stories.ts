import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs, commonTableExcludedControls } from '../common/storyArgTypes'
import { StateEnum } from '../common/constants/StateEnum'
import type { DataOptions } from '../common/types'
import { ref, watch } from 'vue'
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
	title: 'Composants/Tableaux/SyServerTable',
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
		items: {
			description: 'Liste des éléments à afficher dans le tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
				defaultValue: {
					summary: 'undefined',
				},
			},
		},
		serverItemsLength: {
			description: 'Nombre total d\'éléments disponibles côté serveur, utilisé pour calculer la pagination.',
			control: { type: 'number' },
			table: {
				category: 'props',
				type: { summary: 'number' },
				defaultValue: {
					summary: '0',
				},
			},
		},
		showFilters: {
			description: 'Affiche une ligne de filtres au-dessus des données. Les colonnes filtrables sont déclarées dans `headers` et configurables via `filterInputConfig`.',
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
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
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
				
					const getDataFromApi = async ({ sortBy, page, itemsPerPage, filters }: DataOptions): Promise<DataObj> => {
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
                    
                      // Initialize data
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
		...commonTableEventArgs(),
	},
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
				const totalUsers = ref(0)
				const users = ref<User[]>([])
				const state = ref(StateEnum.IDLE)

				const options = ref({ ...args.options })

				watch(options, (newVal) => {
					if (args.options) {
						Object.assign(args.options, JSON.parse(JSON.stringify(newVal)))
					}
				}, { deep: true })

				const fetchData = async (): Promise<void> => {
					const { items, total } = await getDataFromApi(options.value as DataOptions)
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
								const key = sortBy[0]!.key
								const order = sortBy[0]!.order === 'asc' ? 1 : -1

								return a[key]! > b[key]! ? order : -order
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

				// Initialize data
				fetchData()

				return { args, users, state, fetchData, options, totalUsers, StateEnum }
			},
			template: `
			<div>
				<SyServerTable
					v-model:options="options"
					:items="users"
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					v-bind="args"
					@update:options="fetchData"
				/>
			</div>
			`,
		}
	},
}

export const ManyServerTables: Story = {
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

		  const fetchDataTable1 = async (options?: DataOptions): Promise<void> => {
			const optionsToUse = options || optionsTable1.value
			const { items, total } = await getDataFromApi(optionsToUse)
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

		  const fetchDataTable2 = async (options?: DataOptions): Promise<void> => {
			const optionsToUse = options || optionsTable2.value
			const { items, total } = await getDataFromApi(optionsToUse)
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
          
          fetchDataTable1()
          fetchDataTable2()
		</script>
		`,
			},
		],
	},
	args: {
		serverItemsLength: 15, // Add required serverItemsLength property
		headers: [
			{ title: 'Nom', key: 'lastname' },
			{ title: 'Prénom', key: 'firstname' },
			{ title: 'Email', key: 'email' },
		],
		caption: '',
		suffix: 'multi',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
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

				const fetchDataTable1 = async (options?: DataOptions): Promise<void> => {
					const optionsToUse = options || optionsTable1.value as DataOptions
					const { items, total } = await getDataFromApi(optionsToUse)
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

				const fetchDataTable2 = async (options?: DataOptions): Promise<void> => {
					const optionsToUse = options || optionsTable2.value as DataOptions
					const { items, total } = await getDataFromApi(optionsToUse)
					usersTable2.value = items
					totalUsersTable2.value = total
				}

				const wait = async (ms: number) => {
					return new Promise(resolve => setTimeout(resolve, ms))
				}

				const getDataFromApi = async ({ sortBy, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
					const state = sortBy[0]!.key === 'lastname' ? stateTable1 : stateTable2
					state.value = StateEnum.PENDING
					await wait(1000)

					return new Promise((resolve) => {
						let items: User[] = getUsers()
						const total = items.length

						if (sortBy && sortBy.length > 0) {
							items = items.sort((a, b) => {
								const key = sortBy[0]!.key
								const order = sortBy[0]!.order === 'asc' ? 1 : -1

								return a[key]! > b[key]! ? order : -order
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

				// Chargement initial des données
				fetchDataTable1()
				fetchDataTable2()

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
		  v-bind="args"
		  v-model:options="optionsTable1"
		  :items="usersTable1"
		  :server-items-length="totalUsersTable1"
		  :loading="stateTable1 === StateEnum.PENDING"
		  suffix="table1"
		  class="mb-10"
		  @update:options="fetchDataTable1"
		/>
		<SyServerTable
		  v-bind="args"
		  v-model:options="optionsTable2"
		  :items="usersTable2"
		  :server-items-length="totalUsersTable2"
		  :loading="stateTable2 === StateEnum.PENDING"
		  suffix="table2"
		  @update:options="fetchDataTable2"
		/>
	  </div>
	  `,
		}
	},
}
