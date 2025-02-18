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
			control: { type: 'object' },
			table: {
				category: 'props',
			},
		},
		items: {
			control: { type: 'object' },
			table: {
				category: 'props',
			},
		},
		options: {
			control: { type: 'object' },
		},
		serverItemsLength: {
			control: { type: 'number' },
		},
		suffix: {
			control: { type: 'text' },
		},
		itemsPerPage: {
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
					<PaginatedTable
						:options="options"
						:headers="headers"
						:items="items"
						@update:options="options.value = $event"
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
					:items="args.items"
					:headers="args.headers"
					:options="args.options"
					@update:options="args.options.value = $event"
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
						:options="options"
						:headers="headers"
						:items="items"
						@update:options="options.value = $event"
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
					:items="args.items"
					:headers="args.headers"
					:options="args.options"
					@update:options="args.options.value = $event"
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
						:items="users"
						:headers="headers"
						:options="options"
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
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const totalUsers = ref(0)
					const users = ref<User[]>([])
					const state = ref(StateEnum.IDLE)
					
					const options = ref({
					  itemsPerPage: 5,
					  sortBy: 'lastname',
					  sortDesc: false,
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
					
					const getDataFromApi = async ({ sortBy, sortDesc, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
					  state.value = StateEnum.PENDING
					  await wait(1000)
					
					  return new Promise((resolve) => {
						let items: User[] = getUsers()
						const total = items.length
					
						if (sortBy) {
						  items = items.sort((a, b) => {
							const sortA = a[sortBy[0]]
							const sortB = b[sortBy[0]]
					
							if (sortDesc) {
							  if (sortA < sortB) return 1
							  if (sortA > sortB) return -1
							  return 0
							} else {
							  if (sortA < sortB) return -1
							  if (sortA > sortB) return 1
							  return 0
							}
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
			sortBy: 'lastname',
			sortDesc: false,
			page: 1,
		},
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
					sortBy: 'lastname',
					sortDesc: false,
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

				const getDataFromApi = async ({ sortBy, sortDesc, page, itemsPerPage }: DataOptions): Promise<DataObj> => {
					state.value = StateEnum.PENDING
					await wait(1000)

					return new Promise((resolve) => {
						let items: User[] = getUsers()
						const total = items.length

						if (sortBy) {
							items = items.sort((a, b) => {
								const sortA = a[sortBy[0]]
								const sortB = b[sortBy[0]]

								if (sortDesc) {
									if (sortA < sortB) return 1
									if (sortA > sortB) return -1
									return 0
								}
								else {
									if (sortA < sortB) return -1
									if (sortA > sortB) return 1
									return 0
								}
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
					:items="users"
					:headers="headers"
					:options="options"
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
