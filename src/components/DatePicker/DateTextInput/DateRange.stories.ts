import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from '@storybook/test'

// Define the props interface for DatePicker component
interface DatePickerProps {
	'modelValue'?: string | string[] | null
	'label'?: string
	'placeholder'?: string
	'format'?: string
	'dateFormatReturn'?: string
	'density'?: 'default' | 'comfortable' | 'compact'
	'isBirthDate'?: boolean
	'birthDate'?: boolean
	'showWeekNumber'?: boolean
	'required'?: boolean
	'displayRange'?: boolean
	'displayIcon'?: boolean
	'displayAppendIcon'?: boolean
	'displayPrependIcon'?: boolean
	'customRules'?: { type: string, options: Record<string, unknown> }[]
	'customWarningRules'?: { type: string, options: Record<string, unknown> }[]
	'disabled'?: boolean
	'noIcon'?: boolean
	'noCalendar'?: boolean
	'isOutlined'?: boolean
	'readonly'?: boolean
	'width'?: string
	'disableErrorHandling'?: boolean
	'showSuccessMessages'?: boolean
	'bgColor'?: string
	'hideDetails'?: boolean | 'auto'
	'displayWeekendDays'?: boolean
	'displayTodayButton'?: boolean
	'displayHolidayDays'?: boolean
	'useCombinedMode'?: boolean
	'textFieldActivator'?: boolean
	'displayAsterisk'?: boolean
	'period'?: {
		min?: string
		max?: string
	}
	'autoClamp'?: boolean
	// Event handlers
	'onUpdate:modelValue'?: () => void
	'onFocus'?: () => void
	'onBlur'?: () => void
	'onClosed'?: () => void
	'onInput'?: () => void
	'onDate-selected'?: () => void
}

const meta = {
	title: 'Composants/Formulaires/DatePicker/DateInput/DateRange',
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
			defaultValue: 'JJ/MM/AAAA - JJ/MM/AAAA',
		},
		format: {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date',
			defaultValue: 'DD/MM/YYYY',
		},
		dateFormatReturn: {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date pour la valeur de retour',
			defaultValue: '',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
			defaultValue: 'Période',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
			defaultValue: false,
		},
		disabled: {
			control: 'boolean',
			description: 'Désactive le champ',
			defaultValue: false,
		},
		readonly: {
			control: 'boolean',
			description: 'Le champ est en lecture seule',
			defaultValue: false,
		},
		isOutlined: {
			control: 'boolean',
			description: 'Affiche le champ en contour',
			defaultValue: true,
		},
		displayIcon: {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier',
			defaultValue: true,
		},
		displayAppendIcon: {
			control: 'boolean',
			description: 'Icône à la fin du champ',
			defaultValue: false,
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
			defaultValue: false,
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation',
			defaultValue: [],
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement',
			defaultValue: [],
		},
		displayPrependIcon: {
			control: 'boolean',
			description: 'Icône au début du champ',
			defaultValue: true,
		},
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs par le composant',
			defaultValue: false,
		},
		showSuccessMessages: {
			control: 'boolean',
			description: 'Affiche les messages de succès',
			defaultValue: true,
		},
		bgColor: {
			control: 'color',
			description: 'Couleur de fond',
			defaultValue: 'white',
		},
		displayRange: {
			control: 'boolean',
			description: 'Sélection de plage de dates',
			defaultValue: true,
		},
		noCalendar: {
			control: 'boolean',
			description: 'Masque le calendrier',
			defaultValue: false,
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ, affecte l\'espacement interne et la hauteur (standard Vuetify)',
			defaultValue: 'default',
		},
		title: {
			controls: 'text',
		},
	},
} as Meta<DatePickerProps>

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
						v-model="dateRange"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
						label="Période"
						display-range
						no-calendar
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA - JJ/MM/AAAA',
		'label': 'Période',
		'displayRange': true,
		'displayIcon': true,
		'isOutlined': true,
		'noCalendar': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
		'onInput': fn(),
		'onDate-selected': fn(),
	},
	render(args) {
		const dateRange = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, dateRange }
			},
			template: `
				<div>
					<DatePicker
						v-model="dateRange"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ dateRange }}
					</div>
				</div>
			`,
		}
	},
}

export const WithInitialValue: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="dateRange"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
						label="Période"
						display-range
						no-calendar
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA - JJ/MM/AAAA',
		'label': 'Période avec valeur initiale',
		'displayRange': true,
		'displayIcon': true,
		'isOutlined': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render(args) {
		const dateRange = ref<string | [string, string] | null>('01/06/2025 - 30/06/2025')
		return {
			components: { DatePicker },
			setup() {
				return { args, dateRange }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Sélection de plage de dates avec valeur initiale :</h4>
					<DatePicker
						v-model="dateRange"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ dateRange }}
					</div>
				</div>
			`,
		}
	},
}

export const WithCustomFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="dateRange"
						format="YYYY-MM-DD"
						date-format-return="DD/MM/YYYY"
						placeholder="AAAA-MM-JJ - AAAA-MM-JJ"
						label="Période (format ISO)"
						display-range
						no-calendar
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'YYYY-MM-DD',
		dateFormatReturn: 'DD/MM/YYYY',
		placeholder: 'AAAA-MM-JJ - AAAA-MM-JJ',
		label: 'Période (format ISO)',
		displayRange: true,
		displayIcon: true,
		isOutlined: true,
	},
	render(args) {
		const dateRange = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, dateRange }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Sélection de plage de dates avec format personnalisé :</h4>
					<DatePicker
						v-model="dateRange"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur (dateFormatReturn: 'DD/MM/YYYY') : {{ dateRange }}
					</div>
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
						v-model="dateRange"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
						label="Période"
						display-range
						no-calendar
						required
						:customRules=[
							{
								type: 'notBeforeDate',
								options: {
									date: '01/01/1995',
									message: 'La periode doit être postérieure ou égale au 01/01/1995',
									fieldIdentifier: 'date',
									},
							},
						],
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		placeholder: 'JJ/MM/AAAA - JJ/MM/AAAA',
		label: 'Période (max 30 jours)',
		displayRange: true,
		displayIcon: true,
		isOutlined: true,
		required: true,
		customRules: [
			{
				type: 'notBeforeDate',
				options: {
					date: '01/01/1999',
					message: 'La date doit être postérieure ou égale au 01/01/1999',
					fieldIdentifier: 'date',
				},
			},
		],
	},
	render(args) {
		const dateRange = ref<string | null>('10/06/1998 - 12/07/1998')
		return {
			components: { DatePicker },
			setup() {
				return { args, dateRange }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Sélection de plage de dates avec validation :</h4>
					<p class="mb-4">La période doit être postérieure ou égale au 01/01/1999</p>
					<DatePicker
						v-model="dateRange"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ dateRange }}
					</div>
				</div>
			`,
		}
	},
}
