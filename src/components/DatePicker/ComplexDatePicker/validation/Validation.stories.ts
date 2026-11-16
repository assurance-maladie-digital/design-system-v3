import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import { VBtn } from 'vuetify/components'
import type { CalendarModeProps } from '../../types'
import DatePickerSyFormValidity from '../../docExamples/DatePickerSyFormValidity.vue'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/CombinedMode/Validation',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div class="pa-5"><story/></div>',
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
}

export default meta

type Story = StoryObj<typeof meta>

export const SyFormLiveValidity: Story = {
	name: 'Validité du SyForm avant soumission',
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: 'Corrigez une date invalide au clavier ou sélectionnez une date dans le calendrier. À la sortie du champ, le formulaire passe à `true` et le bouton Soumettre devient disponible.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm
    v-model="valid"
    class="pa-4"
    @submit="onSubmit"
  >
    <div class="d-flex flex-column align-start ga-4">
      <p>
        Saisissez 32/11/2026 et quittez le champ pour voir l’erreur. Corrigez en 30/11/2026, puis quittez à nouveau le champ.
      </p>
      <DatePicker
        v-model="date"
        label="Date"
        hint="Format attendu : JJ/MM/AAAA"
        persistent-hint
        placeholder="JJ/MM/AAAA"
        format="DD/MM/YYYY"
        required
        use-combined-mode
      />
      <p role="status">
        Validité du SyForm (<code>v-model</code>) <code>{{ String(valid) }}</code>
      </p>
      <div class="d-flex flex-wrap ga-3">
        <VBtn
          type="button"
          variant="outlined"
        >
          Sortir du champ
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          :disabled="valid !== true"
        >
          Soumettre
        </VBtn>
      </div>
      <p
        v-if="submitted !== null"
        role="status"
      >
        Dernière soumission <code>isValid = {{ submitted }}</code>
      </p>
    </div>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const date = ref<string | null>('')
const valid = ref<boolean | null>(null)
const submitted = ref<boolean | null>(null)

function onSubmit({ isValid }: { isValid: boolean }) {
  submitted.value = isValid
}
</script>`,
			},
		],
	},
	render: () => ({
		components: { DatePickerSyFormValidity },
		template: '<DatePickerSyFormValidity mode="combined" />',
	}),
}

const baseArgs = {
	'label': 'Date de la consultation',
	'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
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
		modelValue: '20/08/2026',
		errorMessages: ['Date invalide côté métier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'erreur injecté par le parent en mode combiné.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="value"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    use-combined-mode
    :error-messages="['Date invalide côté métier']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref(args.modelValue ?? null)
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
		warningMessages: ['Date inhabituelle, à vérifier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'avertissement injecté par le parent en mode combiné.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="value"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    use-combined-mode
    :warning-messages="['Date inhabituelle, à vérifier']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref(args.modelValue ?? null)
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
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="value"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    use-combined-mode
    show-success-messages
    :success-messages="['Date validée']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref(args.modelValue ?? null)
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
						label="Date de la consultation"
						help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
						placeholder="JJ/MM/AAAA"
						format="DD/MM/YYYY"
						required
						:customRules="customRules"
						show-success-messages
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
								validate: (value: unknown) => {
									if (value instanceof Date) return value.getFullYear() !== 2024
									return typeof value !== 'string' || !value.endsWith('/2024')
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
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		showSuccessMessages: true,
		useCombinedMode: true,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						if (value instanceof Date) return value.getFullYear() !== 2024
						return typeof value !== 'string' || !value.endsWith('/2024')
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
							label="Date de la consultation"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							required
							class="mb-4"
							useCombinedMode
						/>
						<VBtn type="submit" color="primary">Soumettre</VBtn>
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
					import { VBtn } from 'vuetify/components'
					
					const date = ref('')
					const datePicker = ref<InstanceType<typeof DatePicker> | null>(null)
					const submitted = ref(false)
					
					const submitForm = async () => {
						const isValid = await datePicker.value?.validateOnSubmit()
						submitted.value = isValid === true
					}
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		useCombinedMode: true,
	},
	render: (args) => {
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

				return { args, date, datePicker, submitted, submitForm }
			},
			template: `
              <div class="pa-4">
                <form @submit.prevent="submitForm">
                  <DatePicker
                    ref="datePicker"
                    v-bind="args"
                    v-model="date"
                    class="mb-4"
                  />
                  <VBtn type="submit" color="primary">Soumettre</VBtn>
                </form>
                <div v-if="submitted" class="mt-4 text-success">
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
		controls: { exclude: ['modelValue', 'customRules'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<DatePicker
							v-model="date"
							label="Date de rendez-vous"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
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
								message: "La date ne peut pas être antérieure à aujourd'hui",
							},
					},
				]
					</script>
				`,
			},
		],
	},
	args: {
		label: 'Date de rendez-vous',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		useCombinedMode: true,
	},
	render: (args) => {
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

				const date = ref('')

				return { args, date, customRules }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<DatePicker
						v-bind="args"
						v-model="date"
						:custom-rules="customRules"
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
		controls: { exclude: ['modelValue', 'customWarningRules'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<DatePicker
							v-model="date"
							label="Date de la consultation"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							required
							class="mb-4"
							useCombinedMode
							show-success-messages
							:customWarningRules="customWarningRules"
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
const customWarningRules = [
  {
    type: 'custom',
    options: {
      validate: (value: unknown) => {
        // Sélection dans le calendrier : objet Date
        if (value instanceof Date) return value.getFullYear() !== 2025
        // Saisie clavier : chaîne au format JJ/MM/AAAA
        return typeof value !== 'string' || !value.includes('2025')
      },
      warningMessage: 'Attention : la date est en 2025, vérifiez-la',
      successMessage: 'Date hors 2025',
      fieldIdentifier: 'date',
      isWarning: true,
    },
  },
]
</script>
				`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		showSuccessMessages: true,
		useCombinedMode: true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const customWarningRules = [
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => {
								// Sélection dans le calendrier : objet Date
								if (value instanceof Date) return value.getFullYear() !== 2025
								// Saisie clavier : chaîne au format JJ/MM/AAAA
								return typeof value !== 'string' || !value.includes('2025')
							},
							warningMessage: 'Attention : la date est en 2025, vérifiez-la',
							successMessage: 'Date hors 2025',
							fieldIdentifier: 'date',
							isWarning: true,
						},
					},
				]

				const date = ref('')

				return { args, date, customWarningRules }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<DatePicker
						v-bind="args"
						v-model="date"
						:custom-warning-rules="customWarningRules"
					/>
					<div class="mt-4 text-body-2">Valeur actuelle : {{ date }}</div>
				</div>
			`,
		}
	},
}
