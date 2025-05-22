import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import { StateEnum } from './constants/StateEnum'
import type { DataOptions } from './types'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import PaginatedTable from "../PaginatedTable/PaginatedTable.vue";

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
			},
		},
		serverItemsLength: {
			description: 'Nombre total d\'éléments à afficher',
			control: { type: 'number' },
		},
		suffix: {
			description: 'Suffixe permettant de gérer individuellement le stockage des options d\'un tableau d\'une page à l\'autre. S\'il n\'est pas renseigné, le stockage s\'effectue globalement pour tous les tableaux.',
			control: { type: 'text' },
		},
		itemsPerPage: {
			description: 'Nombre d\'éléments par page',
			control: { type: 'number' },
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
					<SyServerTable
						v-model:options="options"
						:items="users"
						:headers="headers"
						:server-items-length="totalUsers"
						:loading="state === StateEnum.PENDING"
						suffix="api-example"
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
	},
	render: (args) => {
		return {
			components: { SyServerTable },
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
				<SyServerTable
					v-model:options="options"
					:items="users"
					:headers="headers"
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
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
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

				return { args, headers, users, options, state, fetchData, totalUsers, StateEnum }
			},
			template: `
      <div class="pa-4">
        <SyServerTable
          v-model:options="options"
          :items="users"
          :headers="headers"
          :server-items-length="totalUsers"
          :loading="state === StateEnum.PENDING"
          suffix="server-sort"
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
          <div class="pa-4">
            <SyServerTable
              v-model:options="optionsTable1"
              :items="usersTable1"
              :headers="headers"
              :server-items-length="totalUsersTable1"
              :loading="stateTable1 === StateEnum.PENDING"
              suffix="table1"
              @update:options="fetchDataTable1"
            />
            <hr class="my-4">
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
	render: (args) => {
		return {
			components: { SyServerTable },
			setup() {
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

				return {
					args,
					headers,
					usersTable1,
					totalUsersTable1,
					stateTable1,
					optionsTable1,
					fetchDataTable1,
					usersTable2,
					totalUsersTable2,
					stateTable2,
					optionsTable2,
					fetchDataTable2,
					StateEnum,
				}
			},
			template: `
      <div class="pa-4">
        <SyServerTable
          v-model:options="optionsTable1"
          :items="usersTable1"
          :headers="headers"
          :server-items-length="totalUsersTable1"
          :loading="stateTable1 === StateEnum.PENDING"
          suffix="table1"
          @update:options="fetchDataTable1"
        />
        <hr class="my-4">
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
      `,
		}
	},
}
