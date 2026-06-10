import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import LunarCalendar from './LunarCalendar.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta = {
	title: 'Composants/Formulaires/LunarCalendar',
	component: LunarCalendar,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		...getValidationDocumentation('date'),
		modelValue: {
			description: 'La valeur du calendrier lunaire au format DD/MM/YYYY',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		minYear: {
			description: 'Année minimale autorisée',
			control: { type: 'number' },
		},
		maxYear: {
			description: 'Année maximale autorisée',
			control: { type: 'number' },
		},
		placeholder: {
			description: 'Texte affiché lorsque le champ est vide',
			control: { type: 'text' },
		},
		isClearable: {
			description: 'Indique si le champ peut être effacé',
			control: { type: 'boolean' },
		},
		displayPrependIcon: {
			description: 'Affiche une icône au début du champ',
			control: { type: 'boolean' },
		},
		displayAppendIcon: {
			description: 'Affiche une icône à la fin du champ',
			control: { type: 'boolean' },
		},
		// Nouvelles props iso SyTextField
		helpText: {
			description: 'Texte d\'aide affiché sous le champ',
			control: { type: 'text' },
		},
		noIcon: {
			description: 'Désactive les icônes du champ',
			control: { type: 'boolean' },
		},
		displayAsterisk: {
			description: 'Affiche l\'astérisque pour les champs requis',
			control: { type: 'boolean' },
		},
		variantStyle: {
			description: 'Style visuel du champ',
			control: { type: 'select' },
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
		},
		color: {
			description: 'Couleur du champ',
			control: { type: 'select' },
			options: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
		},
		density: {
			description: 'Densité du champ',
			control: { type: 'select' },
			options: ['default', 'comfortable', 'compact'],
		},
		loading: {
			description: 'État de chargement du champ',
			control: { type: 'boolean' },
		},
		hint: {
			description: 'Indice affiché sous le champ',
			control: { type: 'text' },
		},
		bgColor: {
			description: 'Couleur de fond du champ',
			control: { type: 'text' },
		},
		counter: {
			description: 'Compteur de caractères',
			control: { type: 'boolean' },
		},
	},
	args: {
		label: 'Date de naissance',
		modelValue: '',
		required: false,
		readonly: false,
		disabled: false,
		isValidateOnBlur: true,
	},
} satisfies Meta<typeof LunarCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
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
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						required
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
				</div>
			`,
		}
	},
}

export const WithClearable: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						placeholder="21/13/1442"
						is-clearable
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/13/1564')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/13/1564',
		placeholder: '21/13/1442',
		isClearable: true,
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
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
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						help-text="Format attendu : JJ/MM/AAAA"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		helpText: 'Format attendu : JJ/MM/AAAA',
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
				</div>
			`,
		}
	},
}

export const WithLoading: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						loading
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/12/1445',
		loading: true,
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
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
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						disabled
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/12/1445',
		disabled: true,
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
				</div>
			`,
		}
	},
}

export const Readonly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						readonly
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/12/1445',
		readonly: true,
	},
	render: (args) => {
		return {
			components: { LunarCalendar },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<LunarCalendar v-bind="args" v-model="value" />
				</div>
			`,
		}
	},
}
