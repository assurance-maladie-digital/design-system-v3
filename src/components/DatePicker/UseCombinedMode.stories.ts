import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from './DatePicker.vue'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Formulaires/DatePicker/UseCombinedMode',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
	},
	argTypes: {
		modelValue: {
			control: 'text',
			description: 'Valeur du champ',
		},
		placeholder: {
			control: 'text',
			description: 'Texte indicatif',
		},
		format: {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date',
		},
		dateFormatReturn: {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date pour la valeur de retour',
		},
		isBirthDate: {
			control: 'boolean',
			description: 'Mode date de naissance',
		},
		useCombinedMode: {
			control: 'boolean',
			description: 'Active le mode combiné (calendrier + saisie avec formatage automatique)',
		},
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Sélectionner une date"
						format="DD/MM/YYYY"
						useCombinedMode
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		useCombinedMode: true,
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const DateRange: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="dateRange"
						placeholder="Sélectionner une période"
						format="DD/MM/YYYY"
						displayRange
						useCombinedMode
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					
					const dateRange = ref(['', ''])
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Sélectionner une période',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: true,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		useCombinedMode: true,
		modelValue: ['', ''],
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref(['', ''])
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const BirthDate: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date de naissance"
						format="DD/MM/YYYY"
						isBirthDate
						useCombinedMode
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Date de naissance',
		format: 'DD/MM/YYYY',
		isBirthDate: true,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		useCombinedMode: true,
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const WithValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date requise"
						format="DD/MM/YYYY"
						required
						:customRules="customRules"
						useCombinedMode
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					
					const date = ref('')
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (value && new Date(value).getFullYear() === 2024) {
										return false
									}
									return true
								},
								message: 'Les dates en 2024 ne sont pas autorisées',
								successMessage: 'Date valide',
								fieldIdentifier: 'date',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Date requise',
		format: 'DD/MM/YYYY',
		required: true,
		useCombinedMode: true,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (value && new Date(value).getFullYear() === 2024) {
							return false
						}
						return true
					},
					message: 'Les dates en 2024 ne sont pas autorisées',
					successMessage: 'Date valide',
					fieldIdentifier: 'date',
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const DifferentFormats: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="europeanDate"
							placeholder="Format européen"
							format="DD/MM/YYYY"
							useCombinedMode
							class="mb-4"
						/>
						<DatePicker
							v-model="americanDate"
							placeholder="Format américain"
							format="MM/DD/YYYY"
							useCombinedMode
							class="mb-4"
						/>
						<DatePicker
							v-model="isoDate"
							placeholder="Format ISO"
							format="YYYY-MM-DD"
							useCombinedMode
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
					import { DatePicker } from '@cnamts/synapse'
					
					const europeanDate = ref('')
					const americanDate = ref('')
					const isoDate = ref('')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const europeanDate = ref('')
				const americanDate = ref('')
				const isoDate = ref('')

				return { europeanDate, americanDate, isoDate }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <DatePicker
                  v-model="europeanDate"
                  placeholder="Format européen"
                  format="DD/MM/YYYY"
                  useCombinedMode
                  class="mb-4"
                />
                <DatePicker
                  v-model="americanDate"
                  placeholder="Format américain"
                  format="MM/DD/YYYY"
                  useCombinedMode
                  class="mb-4"
                />
                <DatePicker
                  v-model="isoDate"
                  placeholder="Format ISO"
                  format="YYYY-MM-DD"
                  useCombinedMode
                />
              </div>
            `,
		}
	},
}
