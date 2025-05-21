import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import type { DataOptions } from './types'
import { ref } from 'vue'
import type { VDataTableServer } from 'vuetify/components'

interface User {
	[key: string]: string
	firstname: string
	lastname: string
	email: string
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
} satisfies Meta<typeof SyServerTable & typeof VDataTableServer>

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
						:headers="headers"
						:items="items"
						:serverItemsLength="serverItemsLength"
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
					
					const allItems = [
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
					]
					
					const items = ref(allItems.slice(0, 4))
					const serverItemsLength = ref(allItems.length)
					
					watch(options, (newOptions) => {
						const page = newOptions.page || 1
						const itemsPerPage = newOptions.itemsPerPage || 4
						const start = (page - 1) * itemsPerPage
						const end = start + itemsPerPage
						items.value = allItems.slice(start, end)
					}, { deep: true })
				</script>
				`,
			},
		],
	},
	args: {
		// @ts-expect-error - props of VDataTableServer
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
		],
		serverItemsLength: 6,
		options: {
			itemsPerPage: 4,
		},
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref<Partial<DataOptions>>(args.options)
				const allItems = [
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
				]
				const items = ref(allItems.slice(0, 4))
				const serverItemsLength = ref(allItems.length)

				return {
					...args,
					options,
					items,
					serverItemsLength,
				}
			},
			template: `
				<SyServerTable
					v-model:options="options"
					:headers="headers"
					:items="items"
					:serverItemsLength="serverItemsLength"
					:suffix="suffix"
					:itemsPerPage="itemsPerPage"
				/>
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
						:headers="headers"
						:items="items"
						:serverItemsLength="serverItemsLength"
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
					
					const options = ref({
						itemsPerPage: 4,
						sortBy: [
							{
								key: 'lastname',
								order: 'asc',
							},
						],
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
					
					const allItems = [
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
					]
					
					// Sort and paginate items based on options
					const sortAndPaginateItems = (items, options) => {
						let result = [...items]
						
						// Sort
						if (options.sortBy && options.sortBy.length > 0) {
							const { key, order } = options.sortBy[0]
							result.sort((a, b) => {
								if (order === 'asc') {
									return a[key].localeCompare(b[key])
								} else {
									return b[key].localeCompare(a[key])
								}
							})
						}
						
						// Paginate
						const page = options.page || 1
						const itemsPerPage = options.itemsPerPage || 4
						const start = (page - 1) * itemsPerPage
						const end = start + itemsPerPage
						
						return result.slice(start, end)
					}
					
					const items = ref(sortAndPaginateItems(allItems, options.value))
					const serverItemsLength = ref(allItems.length)
					
					watch(options, (newOptions) => {
						items.value = sortAndPaginateItems(allItems, newOptions)
					}, { deep: true })
				</script>
				`,
			},
		],
	},
	args: {
		// @ts-expect-error - props of VDataTableServer
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
		],
		serverItemsLength: 6,
		options: {
			itemsPerPage: 4,
			sortBy: [
				{
					key: 'lastname',
					order: 'asc',
				},
			],
		},
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options = ref<Partial<DataOptions>>(args.options)
				const allItems = [
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
				]

				// Sort and paginate items based on options
				const sortAndPaginateItems = (items: User[], opts: Partial<DataOptions>) => {
					const result = [...items]

					// Sort
					if (opts.sortBy && opts.sortBy.length > 0) {
						const { key, order } = opts.sortBy[0]
						result.sort((a, b) => {
							if (order === 'asc') {
								return a[key].localeCompare(b[key])
							}
							else {
								return b[key].localeCompare(a[key])
							}
						})
					}

					// Paginate
					const page = opts.page || 1
					const itemsPerPage = opts.itemsPerPage || 4
					const start = (page - 1) * itemsPerPage
					const end = start + itemsPerPage

					return result.slice(start, end)
				}

				const items = ref(sortAndPaginateItems(allItems, options.value))
				const serverItemsLength = ref(allItems.length)

				return {
					...args,
					options,
					items,
					serverItemsLength,
				}
			},
			template: `
				<SyServerTable
					v-model:options="options"
					:headers="headers"
					:items="items"
					:serverItemsLength="serverItemsLength"
					:suffix="suffix"
					:itemsPerPage="itemsPerPage"
				/>
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
							v-model:options="options1"
							:headers="headers"
							:items="items1"
							:serverItemsLength="serverItemsLength"
							suffix="server-table1"
						/>
						<SyServerTable
							v-model:options="options2"
							:headers="headers"
							:items="items2"
							:serverItemsLength="serverItemsLength"
							suffix="server-table2"
						/>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref, watch } from 'vue'
					import { SyServerTable } from '@cnamts/synapse'
					
					const options1 = ref({
						itemsPerPage: 4,
					})
					
					const options2 = ref({
						itemsPerPage: 2,
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
					
					const allItems = [
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
					]
					
					const items1 = ref(allItems.slice(0, 4))
					const items2 = ref(allItems.slice(0, 2))
					const serverItemsLength = ref(allItems.length)
					
					watch(options1, (newOptions) => {
						const page = newOptions.page || 1
						const itemsPerPage = newOptions.itemsPerPage || 4
						const start = (page - 1) * itemsPerPage
						const end = start + itemsPerPage
						items1.value = allItems.slice(start, end)
					}, { deep: true })
					
					watch(options2, (newOptions) => {
						const page = newOptions.page || 1
						const itemsPerPage = newOptions.itemsPerPage || 2
						const start = (page - 1) * itemsPerPage
						const end = start + itemsPerPage
						items2.value = allItems.slice(start, end)
					}, { deep: true })
				</script>
				`,
			},
		],
	},
	args: {
		// @ts-expect-error - props of VDataTableServer
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
		serverItemsLength: 6,
	},
	render(args) {
		return {
			components: { SyServerTable },
			setup() {
				const options1 = ref<Partial<DataOptions>>({
					itemsPerPage: 4,
				})
				const options2 = ref<Partial<DataOptions>>({
					itemsPerPage: 2,
				})

				const allItems = [
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
				]

				const items1 = ref(allItems.slice(0, 4))
				const items2 = ref(allItems.slice(0, 2))
				const serverItemsLength = ref(allItems.length)

				return {
					...args,
					options1,
					options2,
					items1,
					items2,
					serverItemsLength,
				}
			},
			template: `
				<div>
					<SyServerTable
						v-model:options="options1"
						:headers="headers"
						:items="items1"
						:serverItemsLength="serverItemsLength"
						suffix="server-table1"
						class="mb-10"
					/>
					<SyServerTable
						v-model:options="options2"
						:headers="headers"
						:items="items2"
						:serverItemsLength="serverItemsLength"
						suffix="server-table2"
					/>
				</div>
			`,
		}
	},
}
