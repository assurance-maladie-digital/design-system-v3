import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import { VBtn } from 'vuetify/components'
import type { CalendarModeProps } from '../../types'

const meta = {
	title: 'Composants/Formulaires/DatePicker/CombinedMode/Validation',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
		actions: { argTypesRegex: '^on.*' },
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
	'label': 'Date (JJ/MM/AAAA)',
	'placeholder': 'JJ/MM/AAAA',
	'format': 'DD/MM/YYYY',
	'isBirthDate': false,
	'showWeekNumber': false,
	'required': false,
	'displayRange': false,
	'displayIcon': true,
	'displayAppendIcon': false,
	'displayPrependIcon': true,
	'disabled': false,
	'noIcon': false,
	'noCalendar': false,
	'modelValue': '',
	'onUpdate:modelValue': fn(),
	'onFocus': fn(),
	'onBlur': fn(),
	'onClosed': fn(),
	'onDate-selected': fn(),
	'displayTodayButton': true,
	'displayWeekendDays': true,
	'displayHolidayDays': true,
	'useCombinedMode': true,
} satisfies CalendarModeProps & Record<string, unknown>

export const WithError: Story = {
	args: {
		...baseArgs,
		label: 'Date avec erreur injectée',
		errorMessages: ['Date invalide côté métier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'erreur injecté par le parent en mode combiné.',
			},
		},
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const WithWarning: Story = {
	args: {
		...baseArgs,
		modelValue: '20/08/2026',
		label: 'Date avec warning injecté',
		warningMessages: ['Date inhabituelle, à vérifier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'avertissement injecté par le parent en mode combiné.',
			},
		},
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('20/08/2026')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const WithSuccess: Story = {
	args: {
		...baseArgs,
		modelValue: '20/08/2026',
		label: 'Date avec succès injecté',
		showSuccessMessages: true,
		successMessages: ['Date validée'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message de succès injecté par le parent en mode combiné.',
			},
		},
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('20/08/2026')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const WithValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règles de validation personnalisées avec `customRules`. Saisissez une date en 2024 pour déclencher l\'erreur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
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
									if (value && new Date(value as string).getFullYear() === 2024) {
										return false
									}
									return true
								},
								message: 'Les dates en 2024 ne sont pas autorisées',
								successMessage: 'Les dates hors 2024 sont autorisées',
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
		label: 'Date (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		useCombinedMode: true,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						if (value && new Date(value as string).getFullYear() === 2024) {
							return false
						}
						return true
					},
					message: 'Les dates en 2024 ne sont pas autorisées',
					successMessage: 'Les dates hors 2024 sont autorisées',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const WithFormSubmission: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration dans un formulaire avec validation à la soumission via `validateOnSubmit()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<form @submit.prevent="submitForm">
						<DatePicker
							ref="datePicker"
							v-model="date"
							label="Date (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							required
							class="mb-4"
							useCombinedMode
						/>
						<v-btn type="submit" color="primary">Soumettre</v-btn>
					</form>
					<div v-if="submitted" class="mt-4">
						Formulaire soumis avec la date: {{ date }}
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
					
					const date = ref('')
					const datePicker = ref(null)
					const submitted = ref(false)
					
					const submitForm = () => {
						const isValid = datePicker.value.validateOnSubmit()
						if (isValid) {
							submitted.value = true
						}
					}
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker, VBtn },
			setup() {
				const date = ref('')
				const datePicker = ref<InstanceType<typeof DatePicker> | null>(null)
				const submitted = ref(false)

				const submitForm = async () => {
					if (!datePicker.value) return
					const isValid = await datePicker.value.validateOnSubmit()
					if (isValid) {
						submitted.value = true
					}
					else {
						submitted.value = false
					}
				}

				return { date, datePicker, submitted, submitForm }
			},
			template: `
              <div class="pa-4">
                <form @submit.prevent="submitForm">
                  <DatePicker
                    ref="datePicker"
                    v-model="date"
					label="Date (JJ/MM/AAAA)"
                    placeholder="JJ/MM/AAAA"
                    format="DD/MM/YYYY"
                    required
					class="mb-4"
					useCombinedMode
                  />
                  <VBtn type="submit" color="primary">Soumettre</VBtn>
                </form>
                <div v-if="submitted" class="mt-4 success--text">
                  Formulaire soumis avec la date: {{ date }}
                </div>
                <div class="mt-4 text-body-2">Valeur actuelle : {{ date }}</div>
              </div>
            `,
		}
	},
}

export const CustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règles personnalisées avec `customRules` : la date ne peut pas être antérieure à aujourd\'hui.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<DatePicker
							v-model="date"
							label="Date de rendez-vous (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							required
							class="mb-4"
							useCombinedMode
							:customRules="customRules"
						/>
					</template>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import { DatePicker } from '@cnamts/synapse'
						import { ref } from 'vue'
						
						const date = ref('')

						const customRules = [
						{
							type: 'notBeforeToday',
							options: {
								message: 'La date ne peut pas être antérieure à aujourd'hui',
							},
					},
				]
					</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const customRules = [
					{
						type: 'notBeforeToday',
						options: {
							message: 'La date ne peut pas être antérieure à aujourd\'hui',
						},
					},
				]

				const date = ref(null)

				return { date, customRules }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<DatePicker
						v-model="date"
						:custom-rules="customRules"
						required
						use-combined-mode
						label="Date de rendez-vous (JJ/MM/AAAA)"
				placeholder="JJ/MM/AAAA"
			/>
			<div class="mt-4 text-body-2">Valeur actuelle : {{ date }}</div>
				</div>
			`,
		}
	},
}

export const CustomWarningRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règles d\'avertissement personnalisées avec `customWarningRules` : un message non bloquant s\'affiche pour les dates en 2025.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<DatePicker
							v-model="date"
							label="Date (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							required
							class="mb-4"
							useCombinedMode
							:customWarningRules="customWarningRules"
						/>
					</template>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import { DatePicker } from '@cnamts/synapse'
						import { ref } from 'vue'
						
						const date = ref('')
						const customWarningRules = [
							{
								type: 'custom',
								options: {
									validate: (value: string | Date) => {
										// check if manual entry
										if (typeof value === 'string') {
											return !value.includes('2025')
										} else {
											// check if DatePicker selection
											return !value.getFullYear().toString().includes('2025')
										}
									},
									warningMessage: 'Les dates en 2025 ne sont pas autorisées',
									successMessage: 'Date hors 2025',
									fieldIdentifier: 'date',
								},
							},
						]
					</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const customWarningRules = [
					{
						type: 'custom',
						options: {
							validate: (value: string | Date) => {
								if (typeof value === 'string') {
									return !value.includes('2025')
								}
								else {
									return !value.getFullYear().toString().includes('2025')
								}
							},
							warningMessage: 'Les dates en 2025 ne sont pas autorisées',
							successMessage: 'Date hors 2025',
							fieldIdentifier: 'date',
							isWarning: true,
						},
					},
				]

				const date = ref('')

				return { date, customWarningRules }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<DatePicker
						v-model="date"
						:custom-warning-rules="customWarningRules"
						required
						use-combined-mode
						label="Date de rendez-vous (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ date }}</div>
				</div>
			`,
		}
	},
}
