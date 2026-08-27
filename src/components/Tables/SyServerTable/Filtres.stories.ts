import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import { commonTableArgTypes, commonTableEventArgs } from '../common/storyArgTypes'
import type { FilterOption, FilterType } from '../common/types'
import { useServerTableDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Filtres',
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
				defaultValue: {
					summary: 'undefined',
				},
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

const serverFilterUsers: Record<string, unknown>[] = [
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

const serverFilterNumberUsers: Record<string, unknown>[] = [
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

const serverFilterSelectUsers: Record<string, unknown>[] = [
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

const serverFilterAutocompleteUsers: Record<string, unknown>[] = [
	{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
	{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
	{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
	{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
	{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
]

const serverFilterDateUsers: Record<string, unknown>[] = [
	{ name: 'Jean-Pierre Dubois', hireDate: dayjs('2025-05-15').format('DD/MM/YYYY') },
	{ name: 'Marie-Claire Lefèvre', hireDate: dayjs('2025-03-10').format('DD/MM/YYYY') },
	{ name: 'François Moreau', hireDate: dayjs('2025-11-22').format('DD/MM/YYYY') },
	{ name: 'Céline Rousseau', hireDate: dayjs('2025-01-08').format('DD/MM/YYYY') },
	{ name: 'Thierry Bertrand', hireDate: dayjs('2025-07-30').format('DD/MM/YYYY') },
]

const serverCustomFilterUsers: Record<string, unknown>[] = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', status: 'Actif' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', status: 'Inactif' },
	{ firstname: 'Étienne', lastname: 'Salois', status: 'En attente' },
	{ firstname: 'Thierry', lastname: 'Bobu', status: 'Actif' },
	{ firstname: 'Bernadette', lastname: 'Langelier', status: 'Inactif' },
	{ firstname: 'Agate', lastname: 'Roy', status: 'En attente' },
]
export const ServerFilterByText: Story = {
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterUsers)
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

export const ServerFilterByNumber: Story = {
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterNumberUsers)
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

export const ServerFilterBySelect: Story = {
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
			  multiple: false,
			  chips: false,
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
			  multiple: false,
			  chips: false,
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
				multiple: false,
				chips: false,
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
				multiple: false,
				chips: false,
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterSelectUsers)
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

export const ServerFilterBySelectMultiple: Story = {
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
			import { StateEnum } from '@cnamts/synapse/components/Tables/common/constants/StateEnum'
			import type { DataOptions, FilterOption } from '@cnamts/synapse/components/Tables/common/types'

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
				filterType: 'text' as const
				},
				{ 
				title: 'Département', 
				key: 'department',
				filterable: true,
				filterType: 'select' as const,
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
				filterType: 'select' as const,
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
							if (Array.isArray(value)) {
								// Empty array means no filter applied
								if (value.length === 0) return true
								// Check if item value is in the selected values
								return value.includes(itemValue)
							}
							else {
								return itemValue === value
							}
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterSelectUsers)
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

export const ServerFilterByAutocomplete: Story = {
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
				:items="filteredUsers"
				:headers="headers"
				:server-items-length="totalFilteredUsers"
				:loading="state === StateEnum.PENDING"
				suffix="server-filter-autocomplete"
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
			import { StateEnum } from '@cnamts/synapse/components/Tables/common/constants/StateEnum'
			import type { DataOptions, FilterOption } from '@cnamts/synapse/components/Tables/common/types'

			interface User {
				name: string
				department: string
				status: string
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
					filterType: 'text' as const,
				},
				{
					title: 'Département',
					key: 'department',
					filterable: true,
					filterType: 'autocomplete' as const,
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
					filterType: 'autocomplete' as const,
					multiple: true,
					chips: true,
					filterOptions: [
						{ text: 'Actif', value: 'Actif' },
						{ text: 'En congé', value: 'En congé' },
						{ text: 'Inactif', value: 'Inactif' },
					],
				},
			]

			const getUsers = (): User[] => [
				{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
				{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
				{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
				{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
				{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
			]

			const fetchData = async (): Promise<void> => {
				state.value = StateEnum.PENDING
				await new Promise(resolve => setTimeout(resolve, 500))
				let items = getUsers()
				if (options.value.filters?.length) {
					options.value.filters.forEach((filter: FilterOption) => {
						const { key, value, type } = filter
						items = items.filter((item) => {
							const itemValue = item[key as keyof User]
							if (type === 'autocomplete') {
								if (Array.isArray(value)) {
									return value.length === 0 || value.includes(itemValue)
								}
								return itemValue === value
							}
							return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
						})
					})
				}
				totalFilteredUsers.value = items.length
				const { page = 1, itemsPerPage = 5 } = options.value
				filteredUsers.value = itemsPerPage > 0
					? items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
					: items
				state.value = StateEnum.RESOLVED
			}

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
				filterType: 'text' as FilterType,
			},
			{
				title: 'Département',
				key: 'department',
				filterable: true,
				filterType: 'autocomplete' as FilterType,
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
				filterType: 'autocomplete' as FilterType,
				multiple: true,
				chips: true,
				filterOptions: [
					{ text: 'Actif', value: 'Actif' },
					{ text: 'En congé', value: 'En congé' },
					{ text: 'Inactif', value: 'Inactif' },
				],
			},
		],
		serverItemsLength: 0,
		suffix: 'server-filter-autocomplete',
		showFilters: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterAutocompleteUsers)
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

export const ServerFilterByExacteDate: Story = {
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
		serverItemsLength: 5,
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
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		caption: '',
		suffix: 'server-filter-date',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterDateUsers)
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

export const ServerFilterByPeriod: Story = {
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
			  filterType: 'period',
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
		serverItemsLength: 5,
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
		options: {
			itemsPerPage: 5,
			page: 1,
			filters: [],
		},
		caption: '',
		suffix: 'server-filter-date',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterDateUsers)
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

export const CustomFilterSlot: Story = {
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
					import { ref, watch } from 'vue'
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
			page: 1,
			filters: [],
		},
		showFilters: true,
		suffix: 'server-custom-filter-slot',
		density: 'default',
		striped: false,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverCustomFilterUsers)

			const customFilterValue = ref('')
			const statusOptions = ['Actif', 'Inactif', 'En attente']

			// Synchronise l'état local du filtre personnalisé dans options.filters
			function handleFilterChange(val: string) {
				if (!options.value.filters) {
					options.value.filters = []
				}
				const currentFilters = options.value.filters as FilterOption[]
				const newFilters = [...currentFilters].filter(f => f.key !== 'status')
				if (val) {
					newFilters.push({
						key: 'status',
						value: val,
						type: 'select' as FilterType,
					})
				}
				options.value = {
					...options.value,
					filters: newFilters,
				}
			}

			return { args, items, totalItems, state, options, fetchData, StateEnum, customFilterValue, statusOptions, handleFilterChange }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model:options="options"
				:items="items"
				:server-items-length="totalItems"
				:loading="state === StateEnum.PENDING"
				@update:options="fetchData"
			>
				<template #filter.custom="{ header, value, updateFilter }">
					<div class="custom-filter-container">
						<div class="custom-filter-info mb-2">
							Filtre personnalisé :
						</div>
						<VSelect
							v-model="customFilterValue"
							:items="statusOptions"
							label="Statut"
							variant="outlined"
							density="compact"
							color="primary"
							bg-color="white"
							@update:model-value="(val) => {
								updateFilter(val);
								handleFilterChange(val);
							}"
						/>
					</div>
				</template>
			</SyServerTable>
		`,
	}),
}

export const CustomFilterInputs: Story = {
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const { items, totalItems, state, options, fetchData, StateEnum } = useServerTableDemo(args, serverFilterUsers)
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
