import type { Meta, StoryObj } from '@storybook/vue3'
import SyTable from './SyTable.vue'
import type { DataOptions, FilterType } from '../common/types'
import { ref } from 'vue'
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
		suffix: 'default-table',
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
					:suffix="args.suffix"
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
		suffix: 'sort-table',
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
					:suffix="args.suffix"
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
		suffix: 'filter-text-table',
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
					:suffix="args.suffix"
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
		items: [
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
		options: {
			itemsPerPage: 5,
			filters: [],
		},
		showFilters: true,
		suffix: 'filter-number-table',
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
					:suffix="args.suffix"
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
		items: [
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
		options: {
			itemsPerPage: 5,
			filters: [],
		},
		showFilters: true,
		suffix: 'filter-select-table',
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
					:suffix="args.suffix"
				/>
			`,
		}
	},
}

export const FilterByDate: Story = {
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
						{
							title: 'Période de congés',
							key: 'vacationPeriod',
							filterable: true,
							filterType: 'period',
							dateFormat: 'DD/MM/YYYY',
						},
					])
					
					const items = ref([
						{
							name: 'Jean Dupont',
							hireDate: dayjs('2020-05-15').format('DD/MM/YYYY'),
							vacationPeriod: { 
							  from: dayjs('2023-07-01').format('DD/MM/YYYY'), 
							  to: dayjs('2023-07-15').format('DD/MM/YYYY') 
							},
						},
						{
							name: 'Marie Martin',
							hireDate: dayjs('2019-03-10').format('DD/MM/YYYY'),
							vacationPeriod: {
							  from: dayjs('2023-08-01').format('DD/MM/YYYY'),
							  to: dayjs('2023-08-20').format('DD/MM/YYYY'),
							},
						},
						{
							name: 'Pierre Dupont',
							hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
							vacationPeriod: {
							  from: dayjs('2025-06-15').format('DD/MM/YYYY'),
							  to: dayjs('2025-07-05').format('DD/MM/YYYY'),
							},
						},
						{
							name: 'Sophie Garnier',
							hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
							vacationPeriod: {
							  from: dayjs('2025-12-20').format('DD/MM/YYYY'),
							  to: dayjs('2025-01-05').format('DD/MM/YYYY'),
							},
						},
						{
							name: 'Thomas Leroy',
							hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
							vacationPeriod: {
							  from: dayjs('2025-09-10').format('DD/MM/YYYY'),
							  to: dayjs('2025-09-25').format('DD/MM/YYYY'),
							},
						},
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
		items: [
			{
				name: 'Jean Dupont',
				hireDate: dayjs('2025-05-15').format('DD/MM/YYYY'),
				vacationPeriod: {
					from: dayjs('2025-07-01').format('DD/MM/YYYY'),
					to: dayjs('2025-07-15').format('DD/MM/YYYY'),
				},
			},
			{
				name: 'Marie Martin',
				hireDate: dayjs('2025-03-10').format('DD/MM/YYYY'),
				vacationPeriod: {
					from: dayjs('2025-08-01').format('DD/MM/YYYY'),
					to: dayjs('2025-08-20').format('DD/MM/YYYY'),
				},
			},
			{
				name: 'Pierre Durand',
				hireDate: dayjs('2025-11-22').format('DD/MM/YYYY'),
				vacationPeriod: {
					from: dayjs('2025-06-15').format('DD/MM/YYYY'),
					to: dayjs('2025-07-05').format('DD/MM/YYYY'),
				},
			},
			{
				name: 'Sophie Petit',
				hireDate: dayjs('2025-01-08').format('DD/MM/YYYY'),
				vacationPeriod: {
					from: dayjs('2025-12-20').format('DD/MM/YYYY'),
					to: dayjs('2025-01-05').format('DD/MM/YYYY'),
				},
			},
			{
				name: 'Thomas Leroy',
				hireDate: dayjs('2025-07-30').format('DD/MM/YYYY'),
				vacationPeriod: {
					from: dayjs('2025-09-10').format('DD/MM/YYYY'),
					to: dayjs('2025-09-25').format('DD/MM/YYYY'),
				},
			},
		],
		options: {
			itemsPerPage: 5,
			filters: [],
		},
		showFilters: true,
		suffix: 'filter-date-table',
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
					:suffix="args.suffix"
				/>
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
					<SyTable
						v-model:options="options"
						:headers="headers"
						:items="items"
						show-filters
						suffix="custom-filter-slot-table"
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
									@update:model-value="(val) => {
										// Créer manuellement un filtre de sélection
										const currentFilters = [...options.filters || []]
										// Supprimer le filtre existant pour cette clé si nécessaire
										const filteredFilters = currentFilters.filter(f => f.key !== 'status')
										// Ajouter un nouveau filtre si la valeur n'est pas vide
										if (val) {
											filteredFilters.push({ key: 'status', value: val, type: 'select' })
										}
										// Mettre à jour les options avec les nouveaux filtres
										options.filters = filteredFilters
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
						itemsPerPage: 4,
						filters: []
					})
					
					const customFilterValue = ref('')
					const statusOptions = ['Actif', 'Inactif', 'En attente']
					
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
		options: {
			itemsPerPage: 4,
			filters: [],
		},
		showFilters: true,
		suffix: 'custom-filter-slot-table',
	},
	render(args) {
		return {
			components: { SyTable },
			setup() {
				// Create reactive references
				const options = ref(args.options)
				const items = ref(args.items)
				const customFilterValue = ref('')
				const statusOptions = ['Actif', 'Inactif', 'En attente']

				return {
					args,
					options,
					items,
					customFilterValue,
					statusOptions,
				}
			},
			template: `
				<SyTable
					v-model:options="options"
					:headers="args.headers"
					:items="items"
					:show-filters="args.showFilters"
					:suffix="args.suffix"
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
								@update:model-value="(val) => {
									// Manually create a select filter
									const currentFilters = [...options.filters || []]
									// Remove existing filter for this key if any
									const filteredFilters = currentFilters.filter(f => f.key !== 'status')
									// Add new filter if value is not empty
									if (val) {
										filteredFilters.push({ key: 'status', value: val, type: 'select' })
									}
									// Update options with new filters
									options.filters = filteredFilters
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
		filterInputConfig: {
			variant: 'outlined',
			density: 'comfortable',
			hideDetails: true,
			clearable: false,
			disableErrorHandling: true,
		},
		showFilters: true,
		suffix: 'filter-text-table',
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
					:filter-input-config="args.filterInputConfig"
					:suffix="args.suffix"
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
							:headers="args.headers"
							:items="items1"
							suffix="table-1"
						/>
						<SyTable
							v-model:options="options2"
							:headers="args.headers"
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
		suffix: 'multi-server',
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
						resizableColumns
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
		resizableColumns: true,
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
					:resizableColumns="args.resizableColumns"
				/>
			`,
		}
	},
}
