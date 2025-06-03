import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import { StateEnum } from '../common/constants/StateEnum'
import type { DataOptions } from '../common/types'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'

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
		serverItemsLength: 15,
		suffix: 'server-default',
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
					:server-items-length="totalUsers"
					:loading="state === StateEnum.PENDING"
					:suffix="args.suffix"
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
		serverItemsLength: 0,
		suffix: 'server-sort',
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
          :server-items-length="totalUsers"
          :loading="state === StateEnum.PENDING"
          :suffix="args.suffix"
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
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		showFilters: true,
		suffix: 'server-filter-text',
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
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
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
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		serverItemsLength: 15,
		showFilters: true,
		suffix: 'server-filter-number',
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
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
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
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		serverItemsLength: 15,
		showFilters: true,
		suffix: 'server-filter-select',
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
						:server-items-length="totalFilteredUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="args.showFilters"
						:suffix="args.suffix"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const ServerFilterByDate: Story = {
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
            vacationPeriod: {
              from: string
              to: string
            }
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
            { 
              title: 'Période de congés', 
              key: 'vacationPeriod',
              filterable: true,
              filterType: 'period',
              dateFormat: 'DD/MM/YYYY'
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
			{
				title: 'Période de congés',
				key: 'vacationPeriod',
				filterable: true,
				filterType: 'period',
				dateFormat: 'DD/MM/YYYY',
			},
		],
		suffix: 'server-filter-date',
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
						vacationPeriod: {
							from: dayjs('2025-07-01').format('DD/MM/YYYY'),
							to: dayjs('2025-07-15').format('DD/MM/YYYY'),
						},
					},
					{
						name: 'Marie-Claire Lefèvre',
						hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
						vacationPeriod: {
							from: dayjs('2025-08-01').format('DD/MM/YYYY'),
							to: dayjs('2025-08-20').format('DD/MM/YYYY'),
						},
					},
					{
						name: 'François Moreau',
						hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
						vacationPeriod: {
							from: dayjs('2025-06-15').format('DD/MM/YYYY'),
							to: dayjs('2025-07-05').format('DD/MM/YYYY'),
						},
					},
					{
						name: 'Céline Rousseau',
						hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
						vacationPeriod: {
							from: dayjs('2025-12-20').format('DD/MM/YYYY'),
							to: dayjs('2026-01-05').format('DD/MM/YYYY'),
						},
					},
					{
						name: 'Thierry Bertrand',
						hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
						vacationPeriod: {
							from: dayjs('2025-09-10').format('DD/MM/YYYY'),
							to: dayjs('2025-09-25').format('DD/MM/YYYY'),
						},
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
									// Handle period filter type
									const period = itemValue as { from: string, to: string }
									const filterPeriod = value as { from: string, to: string }

									// Simple period comparison for demo purposes
									if (filterPeriod.from && !filterPeriod.to) {
										return period.from === filterPeriod.from
									}
									else if (!filterPeriod.from && filterPeriod.to) {
										return period.to === filterPeriod.to
									}
									else if (filterPeriod.from && filterPeriod.to) {
										return period.from === filterPeriod.from && period.to === filterPeriod.to
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
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						:show-filters="true"
						:suffix="args.suffix"
						@update:options="fetchData"
					/>
				</div>
			`,
		}
	},
}

export const MultiServerTables: Story = {
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
		suffix: 'multi',
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
          :server-items-length="totalUsersTable1"
          :loading="stateTable1 === StateEnum.PENDING"
          suffix="table1"
		  class="mb-10"
          @update:options="fetchDataTable1"
        />
        <SyServerTable
          v-model:options="optionsTable2"
          :items="usersTable2"
          :headers="args.headers"
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
