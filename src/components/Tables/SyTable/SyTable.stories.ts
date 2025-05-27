import type { Meta, StoryObj } from '@storybook/vue3'
import SyTable from './SyTable.vue'
import type { DataOptions } from '../common/types'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'

const meta = {
	title: 'Composants/Tableaux/SyTable',
	component: SyTable,
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
		suffix: {
			description: 'Suffixe permettant de gérer individuellement le stockage des options d\'un tableau d\'une page à l\'autre. S\'il n\'est pas renseigné, le stockage s\'effectue globalement pour tous les tableaux.',
			control: { type: 'text' },
		},
		itemsPerPage: {
			description: 'Nombre d\'éléments par page',
			control: { type: 'number' },
		},
		showFilters: {
			description: 'Affiche les filtres au-dessus du tableau',
			control: { type: 'boolean' },
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyTable } from '@cnamts/synapse'
					
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
	render(args) {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					:headers="args.headers"
					:items="args.items"
				/>
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
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						show-filters
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 4,
						sortBy: [
							{
								key: 'lastname',
								order: 'desc',
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
			sortBy: [
				{
					key: 'lastname',
					order: 'desc',
				},
			],
		},
	},
	render(args) {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					:headers="args.headers"
					:items="args.items"
				/>
			`,
		}
	},
}

export const FilterBy: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="filteredItems"
						show-filters
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref, computed } from 'vue'
					import { SyTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 4,
						filters: []
					})
					
					const headers = ref([
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
							title: 'Email',
							value: 'email',
							filterable: true,
							filterType: 'text'
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
					
					// Filter items based on headers filters
					const filteredItems = computed(() => {
						// If no filters are set, return all items
						if (!options.value.filters || options.value.filters.length === 0) {
							return items.value
						}

						return items.value.filter(item => {
							return options.value.filters.every(filter => {
								if (!filter || !filter.key || !filter.value) return true

								const itemValue = item[filter.key]
								if (typeof itemValue === 'string') {
									return itemValue.toLowerCase().includes(filter.value.toLowerCase())
								}
								return false
							})
						})
					})
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
				title: 'Email',
				value: 'email',
				filterable: true,
				filterType: 'text',
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
			filters: [],
		},
		showFilters: true,
	},
	render(args) {
		return {
			components: { SyTable },
			setup() {
				// Create reactive references
				const options = ref(args.options)
				const items = ref(args.items)

				return {
					args,
					options,
					items,
				}
			},
			template: `
				<SyTable
					v-model:options="options"
					:headers="args.headers"
					:items="items"
					:show-filters="args.showFilters"
				/>
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
					<div>
						<SyTable
							v-model:options="options1"
							:headers="headers"
							:items="items"
							suffix="table1"
						/>
						<SyTable
							v-model:options="options2"
							:headers="headers"
							:items="items"
							suffix="table2"
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
					import { SyTable } from '@cnamts/synapse'
					
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
	},
	render(args) {
		return {
			components: { SyTable },
			setup() {
				const options1 = ref<Partial<DataOptions>>({
					itemsPerPage: 4,
				})
				const options2 = ref<Partial<DataOptions>>({
					itemsPerPage: 2,
				})
				return { args, options1, options2 }
			},
			template: `
				<div>
					<SyTable
						v-model:options="options1"
						:headers="args.headers"
						:items="args.items"
						suffix="table1"
						class="mb-10"
					/>
					<SyTable
						v-model:options="options2"
						:headers="args.headers"
						:items="args.items"
						suffix="table2"
					/>
				</div>
			`,
		}
	},
}
