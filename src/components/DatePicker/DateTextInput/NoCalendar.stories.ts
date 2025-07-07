import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '../DatePicker/DatePicker.vue'
import { ref } from 'vue'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/DatePicker/DateInput',
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
	argTypes: {
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
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
		},
		disabled: {
			control: 'boolean',
			description: 'Désactive le champ',
		},
		readonly: {
			control: 'boolean',
			description: 'Le champ est en lecture seule',
		},
		isOutlined: {
			control: 'boolean',
			description: 'Affiche le champ en contour',
		},
		displayIcon: {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier',
		},
		displayAppendIcon: {
			control: 'boolean',
			description: 'Icône à la fin du champ',
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement',
		},
		displayPrependIcon: {
			control: 'boolean',
			description: 'Icône au début du champ',
		},
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs par le composant',
		},
		showSuccessMessages: {
			control: 'boolean',
			description: 'Affiche les messages de succès',
		},
		bgColor: {
			control: 'color',
			description: 'Couleur de fond',
		},
		displayRange: {
			control: 'boolean',
			description: 'Sélection de plage de dates',
		},
		autoClamp: {
			control: 'boolean',
			description: 'Active le clamping automatique des dates',
		},
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date avec règles de validation',
		'required': true,
		'disabled': false,
		'readonly': false,
		'isOutlined': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'noIcon': false,
		'displayRange': false,
		'displayPrependIcon': false,
		'showSuccessMessages': true,
		'disableErrorHandling': false,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
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
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date avec règles de validation',
		'required': true,
		'disabled': false,
		'readonly': false,
		'isOutlined': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'noIcon': false,
		'displayRange': false,
		'displayPrependIcon': false,
		'showSuccessMessages': true,
		'disableErrorHandling': false,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div>
					<h4 class="mb-4">Sans astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<h4 class="mb-4">Avec astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
						displayAsterisk
					/>
				</div>
			`,
		}
	},
}

export const EuropeanFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						date-format-return="YYYY/MM/DD"
						placeholder="JJ/MM/AAAA"
						required
						no-icon
						no-calendar
					/>

					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						date-format-return="YYYY/MM/DD"
						placeholder="JJ/MM/AAAA"
						required
						no-icon
						no-calendar
						displayAsterisk
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': 'YYYY/MM/DD',
		'placeholder': 'JJ/MM/AAAA',
		'required': true,
		'noIcon': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Format européen avec règles de base (format de date valide) :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur (dateFormatReturn: 'YYYY/MM/DD') : {{ date }}
					</div>
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
						placeholder="DD/MM/YYYY"
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
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': 'DD/MM/YYYY',
		'placeholder': 'DD/MM/YYYY',
		'required': true,
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2024'),
				message: 'Les dates en 2024 ne sont pas autorisées',
				successMessage: 'Les dates hors 2024 sont autorisées',
				fieldIdentifier: 'date',
			},
		}],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
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
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA',
		'customWarningRules': [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2025'),
				warningMessage: 'Les dates en 2025 ne sont pas autorisées',
				successMessage: 'Date hors 2025',
				fieldIdentifier: 'date',
				isWarning: true,
			},
		}],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
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

export const WithAppendIcon: Story = {
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
						no-calendar
						display-append-icon
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA',
		'displayAppendIcon': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Format avec icône en suffixe</h4>
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
								placeholder="Date requise sans erreur"
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
								placeholder="Date requise avec erreur"
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
		noCalendar: true,
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'YYYY/MM/DD',
		placeholder: 'Date requise sans erreur',
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
								placeholder="Date requise avec erreur"
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

export const AutoClampFeature: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<h3>Démonstration de l'auto clamp dans DateTextInput</h3>
						
						<h4 class="mt-4">Format DD/MM/YYYY (séparateur /)</h4>
						<DatePicker
							v-model="dateSlash"
							placeholder="Saisie avec auto clamp - séparateur /"
							format="DD/MM/YYYY"
							noCalendar
							autoClamp
						/>
						
						<h4 class="mt-4">Format DD-MM-YYYY (séparateur -)</h4>
						<DatePicker
							v-model="dateDash"
							placeholder="Saisie avec auto clamp - séparateur -"
							format="DD-MM-YYYY"
							noCalendar

						/>
						
						<h4 class="mt-4">Format YYYY.MM.DD (séparateur .)</h4>
						<DatePicker
							v-model="dateDot"
							placeholder="Saisie avec auto clamp - séparateur ."
							format="YYYY.MM.DD"
							noCalendar
						/>
						
						<h4 class="mt-4">Mode plage de dates (séparateur /)</h4>
						<DatePicker
							v-model="dateRange"
							placeholder="Saisie plage avec auto clamp"
							format="DD/MM/YYYY"
							displayRange
							noCalendar
							autoClamp
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
					
					const dateSlash = ref('')
					const dateDash = ref('')
					const dateDot = ref('')
					const dateRange = ref('')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const dateSlash = ref('')
				const dateDash = ref('')
				const dateDot = ref('')
				const dateRange = ref('')
				return { dateSlash, dateDash, dateDot, dateRange }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <h3>Démonstration de l'auto clamp dans DateTextInput</h3>
                <div class="mb-4 mt-2">Saisissez uniquement des chiffres - les séparateurs seront ajoutés automatiquement selon le format défini</div>
                
                <h4 class="mb-2">Format DD/MM/YYYY (séparateur /)</h4>
                <DatePicker
                  v-model="dateSlash"
                  placeholder="Saisie avec auto clamp - séparateur /"
                  format="DD/MM/YYYY"
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateSlash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format DD-MM-YYYY (séparateur -)</h4>
                <DatePicker
                  v-model="dateDash"
                  placeholder="Saisie avec auto clamp - séparateur -"
                  format="DD-MM-YYYY"
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format YYYY.MM.DD (séparateur .)</h4>
                <DatePicker
                  v-model="dateDot"
                  placeholder="Saisie avec auto clamp - séparateur ."
                  format="YYYY.MM.DD"
                  noCalendar
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDot || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Mode plage de dates (séparateur /)</h4>
                <DatePicker
                  v-model="dateRange"
                  placeholder="Saisie plage avec auto clamp"
                  format="DD/MM/YYYY"
                  displayRange
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateRange || 'aucune plage saisie' }}</div>
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
					<div class="d-flex flex-column gap-4">
						<DatePicker
							v-model="value1"
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value2"
							placeholder="Format MM/DD/YYYY"
							format="MM/DD/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value3"
							placeholder="Format YYYY-MM-DD"
							format="YYYY-MM-DD"
							no-calendar
						/>
						<DatePicker
							v-model="value4"
							placeholder="Format DD-MM-YY"
							format="DD-MM-YY"
							no-calendar
						/>
						<DatePicker
							v-model="value5"
							placeholder="Format DD.MM.YYYY"
							format="DD.MM.YYYY"
							no-calendar
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
					
				const value1 = ref('24/12/2025')
				const value2 = ref('12/24/2025')
				const value3 = ref('2025-12-24')
				const value4 = ref('24-12-25')
				const value5 = ref('24.12.2025')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value1 = ref('24/12/2025')
				const value2 = ref('12/24/2025')
				const value3 = ref('2025-12-24')
				const value4 = ref('24-12-25')
				const value5 = ref('25.12.2025')
				return { value1, value2, value3, value4, value5 }
			},
			template: `
              <div class="d-flex flex-column gap-4 pa-4">
                <DatePicker
                    v-model="value1"
                    placeholder="Format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    no-calendar
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="Format MM/DD/YYYY"
                    format="MM/DD/YYYY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value3"
                    placeholder="Format YYYY-MM-DD"
                    format="YYYY-MM-DD"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value4"
                    placeholder="Format DD-MM-YY"
                    format="DD-MM-YY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value5"
                    placeholder="Format DD.MM.YYYY"
                    format="DD.MM.YYYY"
					no-calendar
					class="py-4"
                />
              </div>
            `,
		}
	},
}
