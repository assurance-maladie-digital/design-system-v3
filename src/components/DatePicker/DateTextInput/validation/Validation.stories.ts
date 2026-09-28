import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import type { DatePickerRule } from '@/components/DatePicker/types'
import { ref } from 'vue'
import { fn } from 'storybook/test'

const meta = {
	title: 'Composants/Formulaires/DatePicker/DateInput/Validation',
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
	'noCalendar': true,
	'format': 'DD/MM/YYYY',
	'dateFormatReturn': '',
	'placeholder': 'JJ/MM/AAAA',
	'label': 'Date (JJ/MM/AAAA)',
	'required': false,
	'disabled': false,
	'readonly': false,
	'isOutlined': true,
	'displayIcon': true,
	'displayAppendIcon': false,
	'noIcon': false,
	'displayRange': false,
	'displayPrependIcon': false,
	'showSuccessMessages': false,
	'disableErrorHandling': false,
	'onUpdate:modelValue': fn(),
	'onFocus': fn(),
	'onBlur': fn(),
} satisfies Record<string, unknown>

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
				story: 'Expose le cas standard d\'un message d\'erreur injecté par le parent, comme sur les autres composants migrés.',
			},
		},
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
				story: 'Expose le cas standard d\'un message d\'avertissement injecté par le parent.',
			},
		},
	},
	render(args) {
		const date = ref<string | null>('20/08/2026')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
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
				story: 'Expose le cas standard d\'un message de succès injecté par le parent.',
			},
		},
	},
	render(args) {
		const date = ref<string | null>('20/08/2026')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const CustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						date-format-return="DD/MM/YYYY"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						label="Date avec règles personnalisées (JJ/MM/AAAA)"
						required
						no-calendar
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: value => !value || !value.includes('2024'),
								message: 'Les dates en 2024 ne sont pas autorisées',
								successMessage: 'Les dates hors 2024 sont autorisées',
								fieldIdentifier: 'date'
							}
						}]"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		...baseArgs,
		dateFormatReturn: 'DD/MM/YYYY',
		label: 'Date avec règles personnalisées (JJ/MM/AAAA)',
		required: true,
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => !value || !(value as string).includes('2024'),
				message: 'Les dates en 2024 ne sont pas autorisées',
				successMessage: 'Les dates hors 2024 sont autorisées',
				fieldIdentifier: 'date',
			},
		}] as DatePickerRule[],
	},
	render(args) {
		const date = ref<string | null>('21/12/2024')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Format avec règles personnalisées :</h4>
					<p class="mb-4">Les dates en 2024 ne sont pas autorisées</p>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const WarningRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
        <template>
          <DatePicker
            v-model="date"
            format="DD/MM/YYYY"
            placeholder="JJ/MM/AAAA"
            label="Date avec règles d'avertissement (JJ/MM/AAAA)"
            no-calendar
            :custom-warning-rules="[{
              type: 'custom',
              options: {
                validate: value => !value || !value.includes('2025'),
                warningMessage: 'Les dates en 2025 ne sont pas autorisées',
                successMessage: 'Date hors 2025',
                fieldIdentifier: 'date',
                isWarning: true
              }
            }]"
          />
        </template>
        `,
			},
		],
	},
	args: {
		...baseArgs,
		label: 'Date avec règles d\'avertissement (JJ/MM/AAAA)',
		customWarningRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => !value || !(value as string).includes('2025'),
				warningMessage: 'Les dates en 2025 ne sont pas autorisées',
				successMessage: 'Date hors 2025',
				fieldIdentifier: 'date',
				isWarning: true,
			},
		}] as DatePickerRule[],
	},
	render(args) {
		const date = ref<string | null>('20/12/2025')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
        <div style="padding: 20px;">
          <h4 class="mb-0">Format avec règles d'avertissement :</h4>
          <p class="mb-4">Les dates en 2025 ne sont pas autorisées</p>
          <DatePicker
            v-model="date"
            v-bind="args"
          />
          <div style="margin-top: 10px; font-family: monospace; color: #666;">
            Valeur : {{ date }}
          </div>
        </div>
      `,
		}
	},
}

export const WithErrorDisabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
        <template>
          <div class="d-flex">
            <div class="mr-4" style="width: 300px;">
              <p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
              <DatePicker
                v-model="date1"
                format="DD/MM/YYYY"
                placeholder="JJ/MM/AAAA"
                label="Date (JJ/MM/AAAA)"
                required
                no-icon
                no-calendar
                :disableErrorHandling="true"
              />
            </div>
            <div style="width: 300px;">
              <p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
              <DatePicker
                v-model="date2"
                format="DD/MM/YYYY"
                placeholder="JJ/MM/AAAA"
                label="Date (JJ/MM/AAAA)"
                required
                no-icon
                no-calendar
              />
            </div>
          </div>
        </template>
        `,
			},
		],
	},
	args: {
		...baseArgs,
		dateFormatReturn: 'YYYY/MM/DD',
		required: true,
		noIcon: true,
		disableErrorHandling: true,
	},
	render(args) {
		const date1 = ref<string | null>(null)
		const date2 = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date1, date2 }
			},
			template: `
        <div style="padding: 20px;">
          <h4 class="mb-4">DateTextInput avec désactivation des erreurs</h4>
          <div class="d-flex mb-4">
            <div class="mr-4" style="width: 300px;">
              <p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
              <DatePicker
                v-model="date1"
                v-bind="args"
              />
              <div style="margin-top: 10px; font-family: monospace; color: #666;">
                Valeur : {{ date1 }}
              </div>
            </div>
            
            <div style="width: 300px;">
              <p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
              <DatePicker
                v-model="date2"
                format="DD/MM/YYYY"
                placeholder="JJ/MM/AAAA"
                label="Date (JJ/MM/AAAA)"
                required
                no-icon
                no-calendar
              />
              <div style="margin-top: 10px; font-family: monospace; color: #666;">
                Valeur : {{ date2 }}
              </div>
            </div>
          </div>
        </div>
      `,
		}
	},
}
