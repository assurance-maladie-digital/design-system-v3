import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import { ref } from 'vue'
import SyTable from './SyTable.vue'
import type { DataOptions, FilterType } from '../common/types'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'

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
		suffix: {
			description: 'Suffixe permettant de gérer individuellement le stockage des options d\'un tableau d\'une page à l\'autre. Ce prop est obligatoire pour garantir un stockage unique pour chaque tableau.',
			control: { type: 'text' },
			table: {
				category: 'props',
				type: { summary: 'string' },
			},
			required: true,
		},
		resizableColumns: {
			description: 'Permet de redimensionner les colonnes du tableau',
		},
		caption: {
			description: 'Texte de la légende du tableau',
			control: { type: 'text' },
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
						suffix="default-table"
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
		'headers': [
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
		'items': [
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
		'options': {
			itemsPerPage: 4,
		},
		'caption': '',
		'suffix': 'default-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					v-bind="args"
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
						suffix="sort-table"
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
		'headers': [
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
		'items': [
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
		'caption': '',
		'options': {
			itemsPerPage: 4,
			sortBy: [
				{
					key: 'lastname',
					order: 'desc',
				},
			],
		},
		'suffix': 'sort-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterByText: Story = {
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
						suffix="filter-text-table"
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
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
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
		'caption': '',
		'options': {
			itemsPerPage: 4,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-text-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterByNumber: Story = {
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
						suffix="filter-number-table"
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
						itemsPerPage: 5,
						filters: []
					})
					
					const headers = ref([
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
						},
					])
						
					const items = ref([
						{
							name: 'Jean Dupont',
							age: 32,
							salary: 45000,
						},
						{
							name: 'Marie Martin',
							age: 28,
							salary: 52000,
						},
						{
							name: 'Pierre Durand',
							age: 45,
							salary: 65000,
						},
						{
							name: 'Sophie Petit',
							age: 36,
							salary: 48000,
						},
						{
							name: 'Thomas Leroy',
							age: 41,
							salary: 58000,
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
			{
				name: 'Jean Dupont',
				age: 32,
				salary: 45000,
			},
			{
				name: 'Marie Martin',
				age: 28,
				salary: 52000,
			},
			{
				name: 'Pierre Durand',
				age: 45,
				salary: 65000,
			},
			{
				name: 'Sophie Petit',
				age: 36,
				salary: 48000,
			},
			{
				name: 'Thomas Leroy',
				age: 41,
				salary: 58000,
			},
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-number-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterBySelect: Story = {
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
						suffix="filter-select-table"
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
						itemsPerPage: 5,
						filters: []
					})
					
					const headers = ref([
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
						},
					])
						
					const items = ref([
						{
							name: 'Jean Dupont',
							department: 'RH',
							status: 'Actif',
						},
						{
							name: 'Marie Martin',
							department: 'IT',
							status: 'En congé',
						},
						{
							name: 'Pierre Durand',
							department: 'Finance',
							status: 'Actif',
						},
						{
							name: 'Sophie Petit',
							department: 'Marketing',
							status: 'Actif',
						},
						{
							name: 'Thomas Leroy',
							department: 'IT',
							status: 'Inactif',
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
			{
				name: 'Jean Dupont',
				department: 'RH',
				status: 'Actif',
			},
			{
				name: 'Marie Martin',
				department: 'IT',
				status: 'En congé',
			},
			{
				name: 'Pierre Durand',
				department: 'Finance',
				status: 'Actif',
			},
			{
				name: 'Sophie Petit',
				department: 'Marketing',
				status: 'Actif',
			},
			{
				name: 'Thomas Leroy',
				department: 'IT',
				status: 'Inactif',
			},
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-select-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterBySelectMultiple: Story = {
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
						suffix="filter-select-table"
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
						itemsPerPage: 5,
						filters: []
					})
					
					const headers = ref([
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
							multiple: true,
							chips: true,
							filterType: 'select',
							hideMessages: true,
							filterOptions: [
								{ text: 'Actif', value: 'Actif' },
								{ text: 'En congé', value: 'En congé' },
								{ text: 'Inactif', value: 'Inactif' },
							]
						},
					])
						
					const items = ref([
						{
							name: 'Jean Dupont',
							department: 'RH',
							status: 'Actif',
						},
						{
							name: 'Marie Martin',
							department: 'IT',
							status: 'En congé',
						},
						{
							name: 'Pierre Durand',
							department: 'Finance',
							status: 'Actif',
						},
						{
							name: 'Sophie Petit',
							department: 'Marketing',
							status: 'Actif',
						},
						{
							name: 'Thomas Leroy',
							department: 'IT',
							status: 'Inactif',
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
			{
				name: 'Jean Dupont',
				department: 'RH',
				status: 'Actif',
			},
			{
				name: 'Marie Martin',
				department: 'IT',
				status: 'En congé',
			},
			{
				name: 'Pierre Durand',
				department: 'Finance',
				status: 'Actif',
			},
			{
				name: 'Sophie Petit',
				department: 'Marketing',
				status: 'Actif',
			},
			{
				name: 'Thomas Leroy',
				department: 'IT',
				status: 'Inactif',
			},
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-select-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterByExactDate: Story = {
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
						:show-filters="true"
						suffix="filter-date-table"
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
					import dayjs from 'dayjs';
					
					const options = ref({
						itemsPerPage: 5,
						filters: [],
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'name',
							filterable: true,
							filterType: 'text',
						},
						{
							title: 'Date d'embauche',
							key: 'hireDate',
							filterable: true,
							filterType: 'date',
							dateFormat: 'DD/MM/YYYY',
						},
					])
					
					const items = ref([
						{
							name: 'Jean Dupont',
							hireDate: dayjs('2020-05-15').format('DD/MM/YYYY'),
						},
						{
							name: 'Marie Martin',
							hireDate: dayjs('2019-03-10').format('DD/MM/YYYY'),
						},
						{
							name: 'Pierre Dupont',
							hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
						},
						{
							name: 'Sophie Garnier',
							hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
						},
						{
							name: 'Thomas Leroy',
							hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
			{
				name: 'Jean Dupont',
				hireDate: dayjs('2025-05-15').format('DD/MM/YYYY'),
			},
			{
				name: 'Marie Martin',
				hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
			},
			{
				name: 'Pierre Durand',
				hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
			},
			{
				name: 'Sophie Petit',
				hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
			},
			{
				name: 'Thomas Leroy',
				hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
			},
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-date-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const FilterByPeriod: Story = {
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
						:show-filters="true"
						suffix="filter-date-table"
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
					import dayjs from 'dayjs';
					
					const options = ref({
						itemsPerPage: 5,
						filters: [],
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'name',
							filterable: true,
							filterType: 'text',
						},
						{
							title: 'Date d'embauche',
							key: 'hireDate',
							filterable: true,
							filterType: 'period',
							dateFormat: 'DD/MM/YYYY',
						},
					])
					
					const items = ref([
						{
							name: 'Jean Dupont',
							hireDate: dayjs('2020-05-15').format('DD/MM/YYYY'),
						},
						{
							name: 'Marie Martin',
							hireDate: dayjs('2019-03-10').format('DD/MM/YYYY'),
						},
						{
							name: 'Pierre Dupont',
							hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
						},
						{
							name: 'Sophie Garnier',
							hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
						},
						{
							name: 'Thomas Leroy',
							hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
			{
				name: 'Jean Dupont',
				hireDate: dayjs('2025-05-15').format('DD/MM/YYYY'),
			},
			{
				name: 'Marie Martin',
				hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
			},
			{
				name: 'Pierre Durand',
				hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
			},
			{
				name: 'Sophie Petit',
				hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
			},
			{
				name: 'Thomas Leroy',
				hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
			},
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-date-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const CustomFilterSlot: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Cette story démontre comment utiliser un slot personnalisé pour le filtrage. Le filtre personnalisé utilise un v-select pour filtrer par statut.',
			},
		},
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
						suffix="custom-filter-slot-table"
					>
						<template #filter.custom="{ header, updateFilter }">
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
										// Use updateFilter provided by the slot props
										updateFilter(val);
										// Also update our local state
										handleFilterChange(val);
									}"
								/>
							</div>
						</template>
					</SyTable>
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
						page: 1,
						itemsPerPage: 4,
						filters: []
					})
					
					const customFilterValue = ref('')
					const statusOptions = ['Actif', 'Inactif', 'En attente']
					
					// Function to update the filter when the select value changes
					function handleFilterChange(val) {
						// Create a new filters array
						const newFilters = options.value.filters.filter(f => f.key !== 'status')
						
						// Add the new filter if a value is selected
						if (val) {
							newFilters.push({
								key: 'status',
								value: val,
								type: 'select' // Use 'select' type for compatibility with filtering logic
							})
						}
						
						// Update the options with the new filters
						options.value = {
							...options.value,
							filters: newFilters
						}
					}
					
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
							title: 'Statut',
							key: 'status',
							filterable: true,
							filterType: 'custom' // Utilisation du type 'custom' pour activer le slot personnalisé
						},
					])
						
					const items = ref([
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
							status: 'Inactif'
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							status: 'En attente'
						}
					])
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
		'headers': [
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
				filterType: 'custom',
			},
		],
		'items': [
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
		'caption': '',
		'options': {
			itemsPerPage: 4,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'custom-filter-slot-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				// Create a fresh copy of the options to avoid reactivity issues
				const options = ref<DataOptions>({
					page: 1,
					itemsPerPage: 4,
					filters: [] as import('../common/types').FilterOption[],
					sortBy: [],
				})

				// Create a reactive reference for the custom filter value
				const customFilterValue = ref('')
				const statusOptions = ['Actif', 'Inactif', 'En attente']

				// Function to update the filter when the select value changes
				function handleFilterChange(val) {
					// Ensure options.value.filters is initialized
					if (!options.value.filters) {
						options.value.filters = []
					}

					// Create a new filters array with proper typing
					const currentFilters = options.value.filters as import('../common/types').FilterOption[]
					const newFilters = [...currentFilters].filter(f => f.key !== 'status')

					// Add the new filter if a value is selected
					if (val) {
						newFilters.push({
							key: 'status',
							value: val,
							type: 'select' as FilterType, // Use 'select' type for compatibility with filtering logic
						})
					}

					// Update the options with the new filters
					options.value = {
						...options.value,
						filters: newFilters,
					}
				}

				return {
					args,
					options,
					customFilterValue,
					statusOptions,
					handleFilterChange,
				}
			},
			template: `
				<SyTable
					v-model:options="options"
					:headers="args.headers"
					:items="args.items"
					show-filters
					suffix="custom-filter-slot-table"
				>
					<template #filter.custom="{ header, updateFilter }">
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
									// Use updateFilter provided by the slot props
									updateFilter(val);
									// Also update our local state
									handleFilterChange(val);
								}"
							/>
						</div>
					</template>
				</SyTable>
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
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						:filter-input-config="filterInputConfig"
						show-filters
						suffix="filter-text-table"
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
					
					const filterInputConfig = ref({
						variant: 'outlined',
						density: 'comfortable',
						hideDetails: true,
						clearable: false,
						disableErrorHandling: true,
					})
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		'items': [
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
		'caption': '',
		'options': {
			itemsPerPage: 4,
			filters: [],
		},
		'filterInputConfig': {
			variant: 'outlined',
			density: 'comfortable',
			hideDetails: true,
			clearable: false,
			disableErrorHandling: true,
		},
		'showFilters': true,
		'suffix': 'filter-text-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
					v-model:options="args.options"
					v-bind="args"
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
					<div class="d-flex flex-column gap-4">
						<SyTable
							v-model:options="options1"
							:headers="headers"
							:items="items1"
							suffix="table-1"
						/>
						<SyTable
							v-model:options="options2"
							:headers="headers"
							:items="items2"
							suffix="table-2"
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
		'headers': [
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
		'items': [
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
		'caption': '',
		'suffix': 'multi-server',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
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
						v-bind="args"
						suffix="table1"
						class="mb-10"
					/>
					<SyTable
						v-model:options="options2"
						v-bind="args"
						suffix="table2"
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
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						suffix="alignment-table"
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
					])

					const items = ref([
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
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
			{
				title: 'ID',
				key: 'id',
				align: 'center',
				sortable: false,
			},
			{
				title: 'Nom',
				key: 'lastname',
				align: 'start',
				sortable: false,
			},
			{
				title: 'Date de naissance',
				key: 'birthdate',
				align: 'center',
				sortable: false,
			},
			{
				title: 'NIR',
				key: 'nir',
				align: 'end',
				sortable: false,
			},
		],
		'items': [
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
		],
		'options': {
			itemsPerPage: 4,
		},
		'suffix': 'alignment-table',
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					v-bind="args"
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
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						:resizable-columns="true"
						suffix="resizable-columns"
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
		'resizableColumns': true,
		'headers': [
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
		'items': [
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
		'options': {
			itemsPerPage: 4,
		},
		'suffix': 'resizable-columns',
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}
