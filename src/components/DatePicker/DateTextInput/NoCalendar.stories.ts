import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import type { DatePickerRule } from '@/components/DatePicker/types'
import { ref } from 'vue'
import { fn } from 'storybook/test'

interface DatePickerProps {
	'modelValue'?: string | string[] | null
	'label'?: string
	'placeholder'?: string
	'format'?: string
	'dateFormatReturn'?: string
	'density'?: 'default' | 'comfortable' | 'compact'
	'showWeekNumber'?: boolean
	'required'?: boolean
	'displayRange'?: boolean
	'displayIcon'?: boolean
	'displayAppendIcon'?: boolean
	'displayPrependIcon'?: boolean
	'customRules'?: DatePickerRule[]
	'customWarningRules'?: DatePickerRule[]
	'errorMessages'?: string[] | null
	'warningMessages'?: string[] | null
	'successMessages'?: string[] | null
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
	'autoClamp'?: boolean
	'displayAsterisk'?: boolean
	'isValidateOnBlur'?: boolean
	'title'?: string | false
	'period'?: { min?: string, max?: string }
	'onUpdate:modelValue'?: () => void
	'onFocus'?: () => void
	'onBlur'?: () => void
	'onInput'?: () => void
	'onDate-selected'?: () => void
}

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
		events: {
			remapEvents: {
				'update:model-value': 'onUpdate:modelValue',
				'focus': 'onFocus',
				'blur': 'onBlur',
				'input': 'onInput',
				'date-selected': 'onDate-selected',
			},
		},
		docs: {
			description: {
				component: '\n## DatePicker en mode text input (noCalendar) - IncompatibilitÃ©s entre props\n\n### ContrÃ´le d\'affichage des icÃ´nes\n- `noIcon: true` masque toutes les icÃ´nes, rendant `displayIcon`, `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayIcon: false` dÃ©sactive les icÃ´nes, rendant `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayAppendIcon` et `displayPrependIcon` sont mutuellement exclusifs; si les deux sont dÃ©finis Ã  `true`, `displayAppendIcon` est prioritaire\n\n### Validation et Ã©tats de champ\n- `readonly: true` dÃ©sactive toutes les validations, y compris `required` et les rÃ¨gles personnalisÃ©es\n- `disabled` et `readonly` sont mutuellement exclusifs\n- `disableErrorHandling: true` peut crÃ©er une incohÃ©rence avec `showSuccessMessages: true`\n\n### Format et saisie\n- `displayRange: true` nÃ©cessite que modelValue soit un tableau de deux dates `[startDate, endDate]`\n- `autoClamp: true` peut court-circuiter certaines validations manuelles\n',
			},
		},
	},
	argTypes: {
		'onUpdate:modelValue': {
			description: 'Ã‰mis lorsque la valeur du champ est mise Ã  jour',
			table: {
				category: 'events',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'onFocus': {
			description: 'Ã‰mis lorsque le champ reÃ§oit le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onBlur': {
			description: 'Ã‰mis lorsque le champ perd le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onInput': {
			description: 'Ã‰mis lors de la saisie dans le champ',
			table: {
				category: 'events',
				type: { summary: '(value: string) => void' },
			},
		},
		'onDate-selected': {
			description: 'Ã‰mis lorsqu\'une date complÃ¨te est saisie manuellement',
			table: {
				category: 'events',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'validateOnSubmit': {
			description: 'Valide le champ et retourne true si valide, false sinon',
			table: {
				category: 'exposed',
				type: { summary: '() => boolean' },
			},
		},
		'focus': {
			description: 'Met le focus sur le champ de saisie de date',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'blur': {
			description: 'Retire le focus du champ de saisie',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'placeholder': {
			control: 'text',
			description: 'Texte indicatif affichÃ© lorsque le champ est vide pour guider l\'utilisateur sur le format attendu',
			defaultValue: 'JJ/MM/AAAA',
		},
		'format': {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date dans le champ (ex: DD/MM/YYYY pour jour/mois/annÃ©e)',
			defaultValue: 'DD/MM/YYYY',
		},
		'dateFormatReturn': {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date Ã©mise par le v-model. Si vide, utilise le mÃªme format que la prop "format"',
			defaultValue: '',
		},
		'label': {
			control: 'text',
			description: 'LibellÃ© du champ affichÃ© au-dessus ou dans le champ de saisie',
			defaultValue: 'Date',
		},
		'required': {
			control: 'boolean',
			description: 'DÃ©finit si le champ est obligatoire et active la validation correspondante',
			defaultValue: false,
		},
		'disabled': {
			control: 'boolean',
			description: 'DÃ©sactive le champ, empÃªchant toute interaction utilisateur et appliquant un style grisÃ©. âš ï¸ Incompatible avec readonly.',
			defaultValue: false,
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule, la valeur peut Ãªtre affichÃ©e mais pas modifiÃ©e par l\'utilisateur. âš ï¸ DÃ©sactive toutes les validations (required, customRules, customWarningRules). Incompatible avec disabled.',
			defaultValue: false,
		},
		'isOutlined': {
			control: 'boolean',
			description: 'Affiche le champ avec un contour complet (style outlined de Vuetify) plutÃ´t qu\'un soulignÃ© simple',
			defaultValue: true,
		},
		'displayIcon': {
			control: 'boolean',
			description: 'ContrÃ´le l\'affichage de l\'icÃ´ne calendrier, Ã  utiliser en conjonction avec displayPrependIcon ou displayAppendIcon. âš ï¸ Sans effet si noIcon est true.',
			defaultValue: true,
		},
		'displayAppendIcon': {
			control: 'boolean',
			description: 'Affiche l\'icÃ´ne calendrier Ã  la fin du champ (Ã  droite). âš ï¸ Sans effet si displayIcon est false ou si noIcon est true. Prioritaire sur displayPrependIcon si les deux sont true.',
			defaultValue: false,
		},
		'noIcon': {
			control: 'boolean',
			description: 'Masque toutes les icÃ´nes du composant, remplace les props displayIcon, displayAppendIcon et displayPrependIcon. âš ï¸ Incompatible avec displayIcon, displayAppendIcon et displayPrependIcon.',
			defaultValue: false,
		},
		'customRules': {
			control: 'object',
			description: 'RÃ¨gles de validation personnalisÃ©es pour la date saisie, affichant des erreurs si non respectÃ©es',
			defaultValue: [],
		},
		'customWarningRules': {
			control: 'object',
			description: 'RÃ¨gles d\'avertissement pour afficher des messages d\'attention sans bloquer la validation',
			defaultValue: [],
		},
		'errorMessages': {
			control: 'object',
			description: 'Messages d\'erreur injectÃ©s depuis le parent',
			defaultValue: null,
		},
		'warningMessages': {
			control: 'object',
			description: 'Messages d\'avertissement injectÃ©s depuis le parent',
			defaultValue: null,
		},
		'successMessages': {
			control: 'object',
			description: 'Messages de succÃ¨s injectÃ©s depuis le parent',
			defaultValue: null,
		},
		'displayPrependIcon': {
			control: 'boolean',
			description: 'Affiche l\'icÃ´ne calendrier au dÃ©but du champ (Ã  gauche). âš ï¸ Sans effet si displayIcon est false, si noIcon est true, ou si displayAppendIcon est true.',
			defaultValue: true,
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'DÃ©sactive la gestion interne des erreurs, permettant Ã  l\'application parente de gÃ©rer les validations. âš ï¸ Peut crÃ©er une incohÃ©rence si showSuccessMessages est true.',
			defaultValue: false,
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succÃ¨s quand la validation est passÃ©e avec succÃ¨s',
			defaultValue: false,
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ de saisie (ex: white, transparent, #f5f5f5)',
			defaultValue: 'white',
		},
		'displayRange': {
			control: 'boolean',
			description: 'Active la sÃ©lection de plage de dates (date dÃ©but - date fin), le v-model retournera un tableau de deux dates. âš ï¸ NÃ©cessite que modelValue soit un tableau de deux dates [startDate, endDate] pour fonctionner correctement.',
			defaultValue: false,
		},
		'autoClamp': {
			control: 'boolean',
			description: 'Active la mise en forme automatique lors de la saisie (ajout des sÃ©parateurs automatiquement). âš ï¸ Peut court-circuiter certaines validations manuelles.',
			defaultValue: false,
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astÃ©risque (*) Ã  cÃ´tÃ© du label pour indiquer visuellement que le champ est obligatoire',
			defaultValue: false,
		},
		'width': {
			control: 'text',
			description: 'Largeur du champ (peut Ãªtre en px, %, em, rem ou toute unitÃ© CSS valide)',
			defaultValue: '100%',
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Active la validation automatique lorsque le champ perd le focus (onBlur)',
			defaultValue: true,
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'DensitÃ© du champ, affecte l\'espacement interne et la hauteur (standard Vuetify)',
			defaultValue: 'default',
		},
		'title': {
			control: 'text',
		},
	},
} as Meta<DatePickerProps>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'

					const date = ref<string | null>(null)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<div>
						<DatePicker
							v-model="date"
							format="DD/MM/YYYY"
							date-format-return=""
							placeholder="JJ/MM/AAAA"
							label="Date (JJ/MM/AAAA)"
							required
							is-outlined
							display-icon
							:no-icon="false"
							:no-calendar="true"
						/>
						<div style="margin-top: 10px; font-family: monospace; color: #666;">
							Valeur : {{ date }}
						</div>
					</div>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date (JJ/MM/AAAA)',
		'required': true,
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
	parameters: {
		sourceCode: [
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'

					const date = ref<string | null>(null)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<div>
						<h4 class="mb-4">Sans astÃ©risque :</h4>
						<DatePicker
							v-model="date"
							format="DD/MM/YYYY"
							placeholder="JJ/MM/AAAA"
							label="Date (JJ/MM/AAAA)"
							required
							is-outlined
							:no-calendar="true"
						/>
						<h4 class="mb-4">Avec astÃ©risque :</h4>
						<DatePicker
							v-model="date"
							format="DD/MM/YYYY"
							placeholder="JJ/MM/AAAA"
							label="Date (JJ/MM/AAAA)"
							required
							is-outlined
							:no-calendar="true"
							display-asterisk
						/>
					</div>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date (JJ/MM/AAAA)',
		'required': true,
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
					<h4 class="mb-4">Sans astÃ©risque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<h4 class="mb-4">Avec astÃ©risque :</h4>
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
            label="Date avec icÃ´ne en suffixe (JJ/MM/AAAA)"
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
		'label': 'Date avec icÃ´ne en suffixe (JJ/MM/AAAA)',
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
          <h4 class="mb-4">Format avec icÃ´ne en suffixe</h4>
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
