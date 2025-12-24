import type { Meta, StoryObj } from '@storybook/vue3'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import { VBtn, VForm } from 'vuetify/components'
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
						display-asterisk
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

export const MultipleSelection: Story = {
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
						multiple
						:chips="false"
						return-object
						clearable
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
				
					const value = ref([])
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
		multiple: true,
		chips: false,
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
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const MultipleSelectionWithChips: Story = {
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
						multiple
						chips
						return-object
						clearable
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
				
					const value = ref([])
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
						disabled
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
						text-key="text"
						plain-text-key="plain"
						value-key="value"
						allow-html
						return-object
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
						{ text: '<abbr title="France">FR</abbr> - France', plain: 'FR - France', value: 'FR' },
						{ text: '<abbr title="Allemagne">DE</abbr> - Allemagne', plain: 'DE - Allemagne', value: 'DE' },
						{ text: '<abbr title="Espagne">ES</abbr> - Espagne', plain: 'ES - Espagne', value: 'ES' },
					]
				</script>
				`,
			},
		],
	},
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

export const withCustomError: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						:items="items"
						:error-messages="errorMessages"
					/>
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyAutocomplete } from '@cnamts/synapse'
					import { VBtn } from 'vuetify/components'
				
					const value = ref(null)
					const search = ref('')
					const items = [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
					]
				
					const errorMessages = ref<string[]>([])
					const triggerError = () => {
						errorMessages.value = ['This is a test error message']
					}
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
		clearable: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn },
			setup() {
				const value = ref(null)
				const search = ref('')
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, value, search, errorMessages, triggerError }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						:error-messages="errorMessages"
						label="Rechercher une personne"
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
				</div>
				<div class="px-4">
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</div>
			`,
		}
	},
}

export const withCustomKey: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						:items="items"
						text-key="customKey"
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
						{ customKey: 'Choix 1', value: '1' },
						{ customKey: 'Choix 2', value: '2' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ customKey: 'Choix 1', value: '1' },
			{ customKey: 'Choix 2', value: '2' },
		],
		minChars: 1,
		debounceMs: 0,
		cache: false,
		textKey: 'customKey',
		valueKey: 'value',
		returnObject: true,
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
						label="Choix"
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const FormValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Exemple d\'utilisation du SyAutocomplete dans un formulaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="submitForm">
    <SyAutocomplete
      v-model="formData.person"
      v-model:search="search"
      :items="items"
      label="Personne"
      required
      display-asterisk
      class="mb-4"
    />
    <VBtn
      type="submit"
      color="primary"
      class="mt-4"
    >
      Soumettre
    </VBtn>
  </VForm>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const formData = ref({
  person: null,
})

const search = ref('')

const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
]

const submitForm = () => {
  console.log('Formulaire soumis:', formData.value)
}
</script>
				`,
			},
		],
	},
	args: {
		items: allPeople,
		label: 'Personne',
		required: true,
		displayAsterisk: true,
		minChars: 1,
		debounceMs: 250,
		cache: true,
		returnObject: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn, VForm },
			setup() {
				const formData = ref({
					person: null,
				})
				const search = ref('')
				const submitForm = () => {
					console.log('Formulaire soumis:', formData.value)
				}
				return { args, formData, search, submitForm }
			},
			template: `
				<div class="pa-4">
					<VForm @submit.prevent="submitForm">
						<SyAutocomplete
							v-model="formData.person"
							v-model:search="search"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn
							type="submit"
							color="primary"
							class="mt-4"
						>
							Soumettre
						</VBtn>
					</VForm>
				</div>
			`,
		}
	},
}

export const WithApiCall: Story = {
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
						:fetch-items="fetchItems"
						:min-chars="2"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { onMounted, ref } from 'vue'
					import { SyAutocomplete } from '@cnamts/synapse'
				
					const value = ref(null)
					const search = ref('')
					const items = ref([])
				
					onMounted(async () => {
						const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
						const data = await response.json()
						items.value = (Array.isArray(data) ? data : [])
							.slice(0, 50)
							.map((country) => ({
								text: country?.name?.common ?? 'Inconnu',
								value: country?.cca2 ?? (country?.name?.common ?? 'Inconnu'),
							}))
					})
				
					const fetchItems = async (query: string) => {
						const url = 'https://restcountries.com/v3.1/name/' + encodeURIComponent(query)
						const response = await fetch(url)
						if (!response.ok) {
							return []
						}
						const data = await response.json()
						return (Array.isArray(data) ? data : [])
							.slice(0, 10)
							.map((country: any) => ({
								text: country?.name?.common ?? 'Inconnu',
								value: country?.cca2 ?? (country?.name?.common ?? 'Inconnu'),
							}))
					}
				</script>
				`,
			},
		],
	},
	args: {
		items: [],
		minChars: 2,
		debounceMs: 0,
		cache: false,
		required: false,
		clearable: true,
		returnObject: true,
		helpText: 'Tapez au moins 2 caractères',
		noDataText: 'Aucun résultat',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				type CountryApiItem = {
					name?: {
						common?: string
					}
					cca2?: string
				}

				const value = ref(null)
				const search = ref('')
				const items = ref<{ text: string, value: string }[]>([])
				const onUpdateModelValue = fn()
				const onUpdateSearch = fn()

				const loadCountries = async () => {
					try {
						const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
						if (!response.ok) {
							return
						}
						const data: unknown = await response.json()
						items.value = (Array.isArray(data) ? (data as CountryApiItem[]) : [])
							.slice(0, 50)
							.map(country => ({
								text: country?.name?.common ?? 'Inconnu',
								value: country?.cca2 ?? (country?.name?.common ?? 'Inconnu'),
							}))
					}
					catch (error) {
						console.error(error)
					}
				}
				void loadCountries()

				const fetchItems = async (query: string) => {
					try {
						const trimmed = query.trim()
						if (trimmed.length < 1) {
							return []
						}
						const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(trimmed)}?fields=name,cca2`
						const response = await fetch(url)
						if (!response.ok) {
							return []
						}
						const data: unknown = await response.json()
						return (Array.isArray(data) ? (data as CountryApiItem[]) : [])
							.slice(0, 10)
							.map(country => ({
								text: country?.name?.common ?? 'Inconnu',
								value: country?.cca2 ?? (country?.name?.common ?? 'Inconnu'),
							}))
					}
					catch (error) {
						console.error(error)
						return []
					}
				}

				return {
					args,
					value,
					search,
					items,
					fetchItems,
					onUpdateModelValue,
					onUpdateSearch,
				}
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						:items="items"
						label="Rechercher un pays (API)"
						:fetch-items="fetchItems"
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
