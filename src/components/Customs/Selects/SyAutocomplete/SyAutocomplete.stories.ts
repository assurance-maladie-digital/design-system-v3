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
	args: {
		'items': [],
		'minChars': 2,
		'debounceMs': 250,
		'cache': true,
		'required': false,
		'clearable': true,
		'returnObject': true,
		'onUpdate:modelValue': fn(),
		'onUpdate:search': fn(),
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref(null)
				const search = ref('')
				const fetchItems = async (query: string) => {
					await new Promise(r => setTimeout(r, 300))
					return allPeople.filter(p => p.text.toLowerCase().includes(query.toLowerCase()))
				}

				return { args, value, search, fetchItems }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-model:search="search"
						v-bind="args"
						:fetch-items="fetchItems"
						label="Rechercher une personne"
						help-text="Saisissez au moins 2 caractères"
					/>
					<div class="mt-4 text-caption">Valeur: {{ value }}</div>
					<div class="mt-1 text-caption">Search: {{ search }}</div>
				</div>
			`,
		}
	},
}
