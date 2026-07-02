import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import { ref } from 'vue'
import SyTable from './SyTable.vue'
import { commonTableArgTypes } from '../common/storyArgTypes'
import type { DataOptions, FilterType } from '../common/types'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'

const meta = {
	title: 'Composants/Tableaux/SyTable/Filtres',
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
		...commonTableArgTypes,
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
		showFilters: {
			description: 'Affiche les filtres au-dessus du tableau',
			control: { type: 'boolean' },
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const FilterByText: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-text-table"
				/>
			`,
		}
	},
}

export const FilterByNumber: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-number-table"
				/>
			`,
		}
	},
}

export const FilterBySelect: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-select-table"
				/>
			`,
		}
	},
}

export const FilterBySelectMultiple: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-select-table"
				/>
			`,
		}
	},
}

export const FilterByAutocomplete: Story = {
	parameters: {
		a11y: {
			disable: true,
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
						suffix="filter-autocomplete-table"
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
							filterType: 'autocomplete',
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
							filterType: 'autocomplete',
							multiple: true,
							chips: true,
							filterOptions: [
								{ text: 'Actif', value: 'Actif' },
								{ text: 'En congé', value: 'En congé' },
								{ text: 'Inactif', value: 'Inactif' },
							]
						},
					])

					const items = ref([
						{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
						{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
						{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
						{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
						{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
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
				filterType: 'autocomplete',
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
				filterType: 'autocomplete',
				multiple: true,
				chips: true,
				filterOptions: [
					{ text: 'Actif', value: 'Actif' },
					{ text: 'En congé', value: 'En congé' },
					{ text: 'Inactif', value: 'Inactif' },
				],
			},
		],
		'items': [
			{ name: 'Jean Dupont', department: 'RH', status: 'Actif' },
			{ name: 'Marie Martin', department: 'IT', status: 'En congé' },
			{ name: 'Pierre Durand', department: 'Finance', status: 'Actif' },
			{ name: 'Sophie Petit', department: 'Marketing', status: 'Actif' },
			{ name: 'Thomas Leroy', department: 'IT', status: 'Inactif' },
		],
		'caption': '',
		'options': {
			itemsPerPage: 5,
			filters: [],
		},
		'showFilters': true,
		'suffix': 'filter-autocomplete-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
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
					suffix="filter-autocomplete-table"
				/>
			`,
		}
	},
}

export const FilterByExactDate: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-date-table"
				/>
			`,
		}
	},
}

export const FilterByPeriod: Story = {
	parameters: {
		a11y: {
			disable: true,
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
					suffix="filter-date-table"
				/>
			`,
		}
	},
}

export const CustomFilterSlot: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
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
		a11y: {
			disable: true,
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
					suffix="filter-custom-input"
				/>
			`,
		}
	},
}
