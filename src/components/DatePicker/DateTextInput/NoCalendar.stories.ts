import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import type { DatePickerRule } from '@/components/DatePicker/types'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import { createInfoNoticeDecorator } from '@/stories/InfoNotice/InfoNotice'

interface DatePickerProps {
	'modelValue'?: string | string[] | null
	'label'?: string
	'helpText'?: string
	'hint'?: string
	'persistentHint'?: boolean
	'placeholder'?: string
	'format'?: string
	'dateFormatReturn'?: string
	'validateWithReturnFormat'?: boolean
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
	'clearable'?: boolean
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
	},
	argTypes: {
		'onUpdate:modelValue': {
			description: 'Émis lorsque la valeur du champ est mise à jour',
			table: {
				category: 'events',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'onFocus': {
			description: 'Émis lorsque le champ reçoit le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onBlur': {
			description: 'Émis lorsque le champ perd le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onInput': {
			description: 'Émis lors de la saisie dans le champ',
			table: {
				category: 'events',
				type: { summary: '(value: string) => void' },
			},
		},
		'onDate-selected': {
			description: 'Emis lorsqu\'une date complète est saisie manuellement',
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
			description: 'Exemple de saisie affiché lorsque le champ est vide. Il ne remplace jamais le libellé ni le `helpText` (RGAA 11.1, 11.2).',
			defaultValue: 'JJ/MM/AAAA',
		},
		'format': {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date dans le champ (ex: DD/MM/YYYY pour jour/mois/année)',
			defaultValue: 'DD/MM/YYYY',
		},
		'dateFormatReturn': {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date émise par le v-model. Si vide, utilise le même format que la prop "format"',
			defaultValue: '',
		},
		'validateWithReturnFormat': {
			control: 'boolean',
			description: 'Opt-in : transmet au `validate` des règles personnalisées la saisie au format `dateFormatReturn` (comme le v-model) au lieu du format d\'affichage. Désactivé par défaut.',
			defaultValue: false,
		},
		'label': {
			control: 'text',
			description: 'Libellé du champ affiché au-dessus ou dans le champ de saisie. RGAA 11.1 et 11.2 : utiliser un intitulé court, explicite et distinct pour chaque champ (ex : « Date de naissance »). Ne pas y répéter le format attendu, à placer dans `helpText`.',
			defaultValue: 'Date',
		},
		'helpText': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ, y compris en cas d\'erreur (comme `SyTextField`). À privilégier pour indiquer le format attendu (ex : « Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres ») sans le répéter dans le `label` (RGAA 11.1, 11.2).',
		},
		'hint': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ et relié à celui-ci par `aria-describedby`. À utiliser avec `persistentHint`. Il est masqué dès qu\'un message est affiché : préférer `helpText` pour indiquer le format attendu ou une contrainte (RGAA 11.1).',
		},
		'persistentHint': {
			control: 'boolean',
			description: 'Garde le `hint` visible en permanence (sinon il n\'apparaît qu\'au focus).',
			defaultValue: false,
		},
		'required': {
			control: 'boolean',
			description: 'Définit si le champ est obligatoire et active la validation correspondante',
			defaultValue: false,
		},
		'disabled': {
			control: 'boolean',
			description: 'Désactive le champ, empêchant toute interaction utilisateur et appliquant un style grisé. ⚠️ Incompatible avec readonly.',
			defaultValue: false,
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule, la valeur peut être affichée mais pas modifiée par l\'utilisateur. ⚠️ Désactive toutes les validations (required, customRules, customWarningRules). Incompatible avec disabled.',
			defaultValue: false,
		},
		'isOutlined': {
			control: 'boolean',
			description: 'Affiche le champ avec un contour complet (style outlined de Vuetify) plutôt qu\'un souligné simple',
			defaultValue: true,
		},
		'displayIcon': {
			control: 'boolean',
			description: 'Contrôle l\'affichage de l\'icône calendrier, à utiliser en conjonction avec displayPrependIcon ou displayAppendIcon. ⚠️ Sans effet si noIcon est true.',
			defaultValue: true,
		},
		'displayAppendIcon': {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier à la fin du champ (à droite). ⚠️ Sans effet si displayIcon est false ou si noIcon est true. Prioritaire sur displayPrependIcon si les deux sont true.',
			defaultValue: false,
		},
		'clearable': {
			control: 'boolean',
			description: 'Affiche le bouton d\'effacement du champ (jamais affiché en readonly). Mettre à false sur petit écran (RGAA 10.4) : `const { mobile } = useDisplay()` (Vuetify) puis `:clearable="!mobile"`.',
			defaultValue: true,
		},
		'noIcon': {
			control: 'boolean',
			description: 'Masque toutes les icônes du composant, remplace les props displayIcon, displayAppendIcon et displayPrependIcon. ⚠️ Incompatible avec displayIcon, displayAppendIcon et displayPrependIcon.',
			defaultValue: false,
		},
		'customRules': {
			control: 'object',
			description: 'Règles de validation personnalisées pour la date saisie, affichant des erreurs si non respectées',
			defaultValue: [],
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles d\'avertissement pour afficher des messages d\'attention sans bloquer la validation',
			defaultValue: [],
		},
		'errorMessages': {
			control: 'object',
			description: 'Messages d\'erreur injectés depuis le parent',
			defaultValue: null,
		},
		'warningMessages': {
			control: 'object',
			description: 'Messages d\'avertissement injectés depuis le parent',
			defaultValue: null,
		},
		'successMessages': {
			control: 'object',
			description: 'Messages de succès injectés depuis le parent',
			defaultValue: null,
		},
		'displayPrependIcon': {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier au début du champ (à gauche). ⚠️ Sans effet si displayIcon est false, si noIcon est true, ou si displayAppendIcon est true.',
			defaultValue: true,
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive la gestion interne des erreurs, permettant à l\'application parente de gérer les validations. ⚠️ Peut créer une incohérence si showSuccessMessages est true.',
			defaultValue: false,
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succès quand la validation est passée avec succès',
			defaultValue: false,
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ de saisie (ex: white, transparent, #f5f5f5)',
			defaultValue: 'white',
		},
		'displayRange': {
			control: 'boolean',
			description: 'Active la sélection de plage de dates (date début - date fin), le v-model retournera un tableau de deux dates. ⚠️ Nécessite que modelValue soit un tableau de deux dates [startDate, endDate] pour fonctionner correctement.',
			defaultValue: false,
		},
		'autoClamp': {
			control: 'boolean',
			description: 'Active la mise en forme automatique lors de la saisie (ajout des séparateurs automatiquement). ⚠️ Peut court-circuiter certaines validations manuelles.',
			defaultValue: false,
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque (*) à côté du label pour indiquer visuellement que le champ est obligatoire',
			defaultValue: false,
		},
		'width': {
			control: 'text',
			description: 'Largeur du champ (peut être en px, %, em, rem ou toute unité CSS valide)',
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
			description: 'Densité du champ, affecte l\'espacement interne et la hauteur (standard Vuetify)',
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
							label="Date de la consultation"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
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
		'label': 'Date de la consultation',
		'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
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

/**
 * Recommandation RGAA 10.4 (reflow, petits écrans) : avec un intitulé long, conserver l'intitulé complet et
 * utiliser `helpText` pour apporter une information complémentaire, et masquer le bouton d'effacement (`:clearable="false"`)
 * pour libérer de la place dans le champ.
 */
export const MobileAccessibilityGuideline: Story = {
	...Default,
	decorators: [
		() => ({
			template: '<div style="max-width: 320px;"><story/></div>',
		}),
		createInfoNoticeDecorator(`
			<code>helpText</code> complète le champ : y répéter l'intitulé
			le ferait lire deux fois par le lecteur d'écran. Utilisez-le pour compléter l'intitulé
			(précision), pas pour le copier.
		`),
	],
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
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						label="Date de début de votre arrêt de travail"
						help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Cette date figure sur votre prescription médicale"
						:no-calendar="true"
						:clearable="false"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		...Default.args,
		required: false,
		label: 'Date de début de votre arrêt de travail',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Cette date figure sur votre prescription médicale',
		clearable: false,
	} as typeof Default.args,
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
						<p>Les champs marqués d'un astérisque (*) sont obligatoires.</p>
						<h4 class="mb-4">Sans astérisque :</h4>
						<DatePicker
							v-model="date"
							format="DD/MM/YYYY"
							label="Date de la consultation"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
							required
							is-outlined
							:no-calendar="true"
						/>
						<h4 class="mb-4">Avec astérisque :</h4>
						<DatePicker
							v-model="date"
							format="DD/MM/YYYY"
							label="Date de l'ordonnance"
							help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
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
		'label': 'Date de la consultation',
		'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
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
					<p class="mb-4">Les champs marqués d'un astérisque (*) sont obligatoires.</p>
					<h4 class="mb-4">Sans astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<h4 class="mb-4">Avec astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
						label="Date de l'ordonnance"
						displayAsterisk
					/>
				</div>
			`,
		}
	},
}

export const WithoutClearButton: Story = {
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
            label="Date de la consultation"
            help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
            no-calendar
            :clearable="false"
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

          const date = ref('01/01/2025')
        </script>
        `,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date de la consultation',
		'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		'clearable': false,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>('01/01/2025')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
        <div style="padding: 20px;">
          <DatePicker
            v-model="date"
            v-bind="args"
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
            label="Date de la consultation"
            help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
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
		'label': 'Date de la consultation',
		'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
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
