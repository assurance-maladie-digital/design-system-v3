import type { Meta, StoryObj } from '@storybook/vue3'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import { ref } from 'vue'
import { fn } from '@storybook/test'

const meta: Meta<typeof SyAutocomplete> = {
	title: 'Composants/Formulaires/Selects/SyAutocomplete',
	component: SyAutocomplete,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['isLoading'] },
	},
	argTypes: {
		fetchItems: { control: false },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
		required: { control: 'boolean' },
		displayAsterisk: { control: 'boolean' },
		textKey: { control: 'text' },
		plainTextKey: { control: 'text' },
		allowHtml: { control: 'boolean' },
		valueKey: { control: 'text' },
		returnObject: { control: 'boolean' },
		clearable: { control: 'boolean' },
		multiple: { control: 'boolean' },
		chips: { control: 'boolean' },
		hideMessages: { control: 'boolean' },
		density: { control: 'select', options: ['default', 'comfortable', 'compact'] },
		width: { control: 'text' },
		helpText: { control: 'text' },
		minChars: { control: 'number' },
		debounceMs: { control: 'number' },
		cache: { control: 'boolean' },
	},
}

export default meta

type Story = StoryObj<typeof meta>

const allPeople = [
	{ text: 'Adrien', value: 'Adrien' },
	{ text: 'Axel', value: 'Axel' },
	{ text: 'Baptiste', value: 'Baptiste' },
	{ text: 'Clement', value: 'Clement' },
	{ text: 'Corentin', value: 'Corentin' },
	{ text: 'Damien', value: 'Damien' },
	{ text: 'David', value: 'David' },
	{ text: 'Eloi', value: 'Eloi' },
	{ text: 'Louis', value: 'Louis' },
	{ text: 'Valentin', value: 'Valentin' },
]

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
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
					import { SyAutocomplete } from '@cnamts/synapse'
				
					const value = ref(null)
					const search = ref('')
					const items = [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
						{ text: 'Baptiste', value: 'Baptiste' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: allPeople,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		required: false,
		clearable: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				const onUpdateModelValue = fn()
				const onUpdateSearch = fn()

				return { args, value, search, onUpdateModelValue, onUpdateSearch }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
						@update:model-value="onUpdateModelValue"
						@update:search="onUpdateSearch"
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
					<div class="mt-1 text-caption">Search: {{ search }}</div>
				</div>
			`,
		}
	},
}

export const HelpText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						:items="items"
						help-text="Veuillez saisir au moins 2 caractères"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyAutocomplete } from '@cnamts/synapse'
				
					const value = ref(null)
					const search = ref('')
					const items = [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
						{ text: 'Baptiste', value: 'Baptiste' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: allPeople,
		helpText: 'Veuillez saisir au moins 1 caractère',
		minChars: 1,
		debounceMs: 250,
		cache: true,
		clearable: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
					/>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						:items="items"
						required
					/>
				</template>
				`,
			},
		],
	},
	args: {
		items: allPeople,
		required: true,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<p class="mb-2 text-caption text-grey-darken-2">Ce champ est obligatoire</p>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
					/>
				</div>
			`,
		}
	},
}

export const RequiredWithAsterisk: Story = {
	args: {
		items: allPeople,
		required: true,
		displayAsterisk: true,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
					/>
				</div>
			`,
		}
	},
}

export const MultipleSelectionWithChips: Story = {
	args: {
		items: allPeople,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		multiple: true,
		chips: true,
		clearable: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref([])
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
						help-text="Saisissez au moins 1 caractère"
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const Disabled: Story = {
	args: {
		items: allPeople,
		disabled: true,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		clearable: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
					/>
				</div>
			`,
		}
	},
}

export const AllowHtml: Story = {
	args: {
		items: [
			{ text: '<abbr title="France">FR</abbr> - France', plain: 'FR - France', value: 'FR' },
			{ text: '<abbr title="Allemagne">DE</abbr> - Allemagne', plain: 'DE - Allemagne', value: 'DE' },
			{ text: '<abbr title="Espagne">ES</abbr> - Espagne', plain: 'ES - Espagne', value: 'ES' },
		],
		textKey: 'text',
		plainTextKey: 'plain',
		valueKey: 'value',
		allowHtml: true,
		returnObject: true,
		minChars: 1,
		debounceMs: 0,
		cache: false,
		clearable: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Pays"
					/>
				</div>
			`,
		}
	},
}

export const NoDataText: Story = {
	args: {
		items: allPeople,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		returnObject: true,
		noDataText: 'Aucun résultat pour cette recherche',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				return { args, value, search }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						label="Rechercher une personne"
						:items="[]"
					/>
				</div>
			`,
		}
	},
}
