import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { ref, onMounted } from 'vue'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/DatePicker/CombinedMode',
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
				'update:modelValue': 'onUpdate:modelValue',
				'focus': 'onFocus',
				'blur': 'onBlur',
				'closed': 'onClosed',
				'input': 'onInput',
				'date-selected': 'onDate-selected',
			},
		},
		docs: {
			description: {
				component: '\n## DatePicker en mode combiné (useCombinedMode) - Incompatibilités entre props\n\n### Contrôle d\'affichage des icônes\n- `noIcon: true` masque toutes les icônes, rendant `displayIcon`, `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayIcon: false` désactive les icônes, rendant `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayAppendIcon` et `displayPrependIcon` sont mutuellement exclusifs; si les deux sont définis à `true`, `displayAppendIcon` est prioritaire\n\n### Modes de fonctionnement\n- `noCalendar` et `useCombinedMode` sont mutuellement exclusifs\n- `noCalendar: true` annule le mode combiné et rend sans effet : `displayWeekendDays`, `displayHolidayDays`, `showWeekNumber` et `textFieldActivator`\n\n### Validation et états de champ\n- `readonly: true` désactive toutes les validations, y compris `required` et les règles personnalisées\n- `disabled` et `readonly` sont mutuellement exclusifs\n- `disableErrorHandling: true` peut créer une incohérence avec `showSuccessMessages: true`\n\n### Format et saisie\n- `birthDate` et `isBirthDate` sont des alias, utiliser l\'un ou l\'autre mais pas les deux\n- `displayRange: true` nécessite que modelValue soit un tableau de deux dates `[startDate, endDate]`\n- `autoClamp: true` peut court-circuiter certaines validations manuelles\n',
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
		'onClosed': {
			description: 'Émis lorsque le calendrier est fermé',
			table: {
				category: 'events',
				type: { summary: '() => void' },
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
			description: 'Émis lorsqu\'une date est sélectionnée via le calendrier ou complétée manuellement',
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
		'isDatePickerVisible': {
			description: 'Indique si le calendrier est actuellement visible',
			table: {
				category: 'exposed',
				type: { summary: 'Ref<boolean>' },
			},
		},
		'selectedDates': {
			description: 'Dates sélectionnées au format Date',
			table: {
				category: 'exposed',
				type: { summary: 'Ref<Date | Date[] | null>' },
			},
		},
		'errorMessages': {
			description: 'Messages d\'erreur actuels',
			table: {
				category: 'exposed',
				type: { summary: 'Ref<string[]>' },
			},
		},
		'handleClickOutside': {
			description: 'Gestionnaire d\'interactions externes au composant',
			table: {
				category: 'exposed',
				type: { summary: '(event: MouseEvent) => void' },
			},
		},
		'handleSelectToday': {
			description: 'Définit la date sur aujourd\'hui',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'openDatePicker': {
			description: 'Ouvre le calendrier de sélection de date',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'toggleDatePicker': {
			description: 'Bascule l\'affichage du calendrier (affiche/masque)',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'handleDateSelected': {
			description: 'Permet de définir une date programmatiquement',
			table: {
				category: 'exposed',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'resetViewMode': {
			description: 'Réinitialise le mode d\'affichage du calendrier',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'modelValue': {
			control: 'text',
			description: 'Valeur du champ (v-model), peut être une chaîne de caractères ou un tableau de deux dates en mode plage',
		},
		'placeholder': {
			control: 'text',
			description: 'Texte indicatif affiché lorsque le champ est vide pour guider l\'utilisateur sur le format attendu',
			defaultValue: 'Sélectionner une date',
		},
		'period': {
			control: 'object',
			description: 'Définit la période sélectionnable dans le calendrier avec des dates min et max (au format MM/DD/YYYY). Les dates hors de cette période seront désactivées',
			defaultValue: {
				min: '',
				max: '',
			},
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
			defaultValue: 'DD/MM/YYYY',
		},
		'isBirthDate': {
			control: 'boolean',
			description: 'Active le mode date de naissance qui commence la navigation du calendrier à l\'année en cours moins 30 ans',
			defaultValue: false,
		},
		'showWeekNumber': {
			control: 'boolean',
			description: 'Affiche les numéros de semaine dans la colonne de gauche du calendrier. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: false,
		},
		'required': {
			control: 'boolean',
			description: 'Définit si le champ est obligatoire et active la validation correspondante',
			defaultValue: false,
		},
		'displayRange': {
			control: 'boolean',
			description: 'Active la sélection de plage de dates (date début - date fin), le v-model retournera un tableau de deux dates. ⚠️ Nécessite que modelValue soit un tableau de deux dates [startDate, endDate] pour fonctionner correctement.',
			defaultValue: false,
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
		'displayPrependIcon': {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier au début du champ (à gauche). ⚠️ Sans effet si displayIcon est false, si noIcon est true, ou si displayAppendIcon est true.',
			defaultValue: true,
		},
		'customRules': {
			control: 'object',
			description: 'Règles de validation personnalisées pour la date saisie ({ type: string, options: any }[]), affichant des erreurs si non respectées',
			defaultValue: [],
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées ({ type: string, options: any }[]) pour afficher des messages d\'attention sans bloquer la validation',
			defaultValue: [],
		},
		'disabled': {
			control: 'boolean',
			description: 'Désactive le champ, empêchant toute interaction utilisateur et appliquant un style grisé. ⚠️ Incompatible avec readonly.',
			defaultValue: false,
		},
		'noIcon': {
			control: 'boolean',
			description: 'Masque toutes les icônes du composant, remplace les props displayIcon, displayAppendIcon et displayPrependIcon. ⚠️ Incompatible avec displayIcon, displayAppendIcon et displayPrependIcon.',
			defaultValue: false,
		},
		'noCalendar': {
			table: {
				category: 'props',
			},
			control: 'boolean',
			description: 'Désactive l\'affichage du calendrier, permettant uniquement la saisie manuelle (utile pour les tests automatisés). ⚠️ Incompatible avec useCombinedMode, displayWeekendDays, displayHolidayDays, showWeekNumber et textFieldActivator.',
			defaultValue: false,
		},
		'isOutlined': {
			control: 'boolean',
			description: 'Affiche le champ avec un contour complet (style outlined de Vuetify) plutôt qu\'un souligné simple',
			defaultValue: true,
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule, la valeur peut être affichée mais pas modifiée par l\'utilisateur. ⚠️ Désactive toutes les validations (required, customRules, customWarningRules). Incompatible avec disabled.',
			defaultValue: false,
		},
		'width': {
			control: 'text',
			description: 'Largeur du champ (peut être en px, %, em, rem ou toute unité CSS valide)',
			defaultValue: '100%',
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive la gestion interne des erreurs, permettant à l\'application parente de gérer les validations. ⚠️ Peut créer une incohérence si showSuccessMessages est true.',
			defaultValue: false,
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succès quand la validation est passée avec succès',
			defaultValue: true,
		},
		'bgColor': {
			control: 'text',
			description: 'Couleur de fond du champ de saisie (ex: white, transparent, #f5f5f5)',
			defaultValue: 'white',
		},
		'textFieldActivator': {
			control: 'boolean',
			description: 'Permet d\'ouvrir le calendrier en cliquant n\'importe où sur le champ texte, pas uniquement sur l\'icône. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: false,
		},
		'displayTodayButton': {
			control: 'boolean',
			description: 'Affiche le bouton "Aujourd\'hui" en bas du calendrier pour sélectionner rapidement la date du jour',
			defaultValue: true,
		},
		'displayWeekendDays': {
			control: 'boolean',
			description: 'Affiche les jours de week-end avec un style spécifique pour les distinguer dans le calendrier. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: true,
		},
		'displayHolidayDays': {
			control: 'boolean',
			description: 'Affiche les jours fériés français avec un style spécifique dans le calendrier. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: true,
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
		'label': {
			control: 'text',
			description: 'Libellé du champ affiché au-dessus ou dans le champ de saisie',
			defaultValue: 'Sélectionner une date',
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Active la validation automatique lorsque le champ perd le focus (onBlur)',
			defaultValue: true,
		},
		'birthDate': {
			control: 'boolean',
			description: 'Alias pour isBirthDate (pour compatibilité avec l\'attribut kebab-case birth-date dans les templates). ⚠️ Utiliser soit birthDate soit isBirthDate, mais pas les deux.',
			defaultValue: false,
		},
		'useCombinedMode': {
			control: 'boolean',
			description: 'Active le mode combiné permettant à la fois la sélection via calendrier et la saisie manuelle de date. ⚠️ Incompatible avec noCalendar.',
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
						useCombinedMode
						format="DD/MM/YYYY"
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
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Sélectionner une date',
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

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Sélectionner une date"
						useCombinedMode
						required
						format="DD/MM/YYYY"
					/>
					<DatePicker
						v-model="date"
						placeholder="Sélectionner une date"
						useCombinedMode
						required
						displayAsterisk
						format="DD/MM/YYYY"
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
				</script>
				`,
			},
		],
	},
	args: {
		'label': 'Sélectionner une date',
		'format': 'DD/MM/YYYY',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': true,
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
				<h4 class="mb-4">Sans astérisque :</h4>
                <DatePicker v-bind="args" v-model="value"/>
				<h4 class="mb-4">Avec astérisque :</h4>
				<DatePicker v-bind="args" displayAsterisk v-model="value"/>
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
						display-range
						use-combined-mode
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
					
					 const dateRange = ref<[string, string] | null>(null)
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Sélectionner une période',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'displayPrependIcon': true,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': ['', ''],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
		'onDate-selected': fn(),
		'useCombinedMode': true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ['2023-01-15', '2023-01-20']
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
		// modelValue est défini dans le setup du render
		useCombinedMode: true,
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
							class="mb-4"
							useCombinedMode
						/>
						<DatePicker
							v-model="americanDate"
							placeholder="Format américain"
							format="MM/DD/YYYY"
							class="mb-4"
							useCombinedMode
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
                  class="mb-4"
				  useCombinedMode
                />
                <DatePicker
                  v-model="americanDate"
                  placeholder="Format américain"
                  format="MM/DD/YYYY"
                  class="mb-4"
				  useCombinedMode
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

export const WithDateFormatReturn: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="date"
							placeholder="Format d'affichage: JJ/MM/AAAA, Format de retour: AAAA-MM-JJ"
							format="DD/MM/YYYY"
							dateFormatReturn="YYYY-MM-DD"
							class="mb-4"
							useCombinedMode
						/>
						<div>Valeur du modèle: {{ date }}</div>
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
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const date = ref('')
				return { date }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <DatePicker
                  v-model="date"
                  placeholder="Format d'affichage: JJ/MM/AAAA, Format de retour: AAAA-MM-JJ"
                  format="DD/MM/YYYY"
                  dateFormatReturn="YYYY-MM-DD"
                  class="mb-4"
				  useCombinedMode
                />
                <div>Valeur du modèle: {{ date }}</div>
              </div>
            `,
		}
	},
}

export const DisablePickerInteraction: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Saisie manuelle uniquement"
						format="DD/MM/YYYY"
						useCombinedMode
						noCalendar
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
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Saisie manuelle uniquement',
		format: 'DD/MM/YYYY',
		displayIcon: true,
		useCombinedMode: true,
		noCalendar: true,
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
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>Le calendrier ne s'ouvrira pas au clic sur l'input ou l'icône.</p>
                </div>
              </div>
            `,
		}
	},
}

export const AutoFormattingInput: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="date"
							placeholder="Saisie avec formatage automatique"
							format="DD-MM-YYYY"
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
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Saisie avec formatage automatique',
		format: 'DD-MM-YYYY',
		useCombinedMode: true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <div class="mb-2">Essayez de saisir des chiffres - les séparateurs seront ajoutés automatiquement</div>
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const CustomDateFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Format AAAA.MM.JJ"
						format="AAAA.MM.JJ"
						useCombinedMode
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
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Format AAAA.MM.JJ',
		format: 'YYYY.MM.DD',
		useCombinedMode: true,
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
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>Le séparateur "." est automatiquement ajouté pendant la saisie.</p>
                </div>
              </div>
            `,
		}
	},
}

export const ReadonlyMode: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date en lecture seule"
						format="DD/MM/YYYY"
						useCombinedMode
						readonly
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePicker } from '@cnamts/synapse'
					import { ref, onMounted } from 'vue'
					
					const date = ref('')
					
					onMounted(() => {
						// Initialiser avec une date
						date.value = '15/06/2023'
					})
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Date en lecture seule',
		format: 'DD/MM/YYYY',
		useCombinedMode: true,
		readonly: true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')

				onMounted(() => {
					// Initialiser avec une date
					value.value = '15/06/2023'
				})
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>Le champ est en lecture seule et ne peut pas être modifié.</p>
                </div>
              </div>
            `,
		}
	},
}

export const AppendIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date avec icône à la fin"
						format="DD/MM/YYYY"
						useCombinedMode
						:displayPrependIcon="false"
						:displayAppendIcon="true"
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
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Date avec icône à la fin',
		format: 'DD/MM/YYYY',
		useCombinedMode: true,
		displayPrependIcon: false,
		displayAppendIcon: true,
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
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>L'icône du calendrier est positionnée à la fin du champ.</p>
                </div>
              </div>
            `,
		}
	},
}

export const WithCustomPeriod: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date avec icône à la fin"
						format="DD/MM/YYYY"
						useCombinedMode
						:period="{
							min: '01/01/1995',
							max: '12/31/2005',
						}"
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

					// Conversion des dates de la période au format Date
					const minDate = new Date('1995-01-01')
					const maxDate = new Date('2005-12-31')

					const customRules = [
						{
							type: 'notBeforeDate',
							options: {
								date: '01/01/1995',
								message: 'La date doit être postérieure ou égale au 01/01/1995',
								fieldIdentifier: 'date',
							},
						},
						{
							type: 'notAfterDate',
							options: {
								date: '31/12/2005',
								message: 'La date doit être antérieure ou égale au 31/12/2005',
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
		placeholder: 'Date avec icône à la fin',
		format: 'DD/MM/YYYY',
		useCombinedMode: true,
		period: {
			min: '01/01/1995',
			max: '12/31/2005',
		},
		customRules: [
			{
				type: 'notBeforeDate',
				options: {
					date: '01/01/1995',
					message: 'La date doit être postérieure ou égale au 01/01/1995',
					fieldIdentifier: 'date',
				},
			},
			{
				type: 'notAfterDate',
				options: {
					date: '31/12/2005',
					message: 'La date doit être antérieure ou égale au 31/12/2005',
					fieldIdentifier: 'date',
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker, SyAlert },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
			<div style="margin-bottom: 20px; padding: 15px;"> 
				<SyAlert variant="tonal" :closable="false">
					<template #default>
					<h4>Note importante pour la validation manuelle</h4>
					<p>Pour valider les dates saisies manuellement en fonction de la période définie, il faut utiliser la propriété customRules comme dans l'exemple ci-dessous.</p>
					<p>La propriété period limite les dates sélectionnables dans le calendrier, mais les règles personnalisées sont nécessaires pour la validation des saisies manuelles.</p>
					</template>
				</SyAlert>
			</div>
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                </div>
              </div>
            `,
		}
	},
}

export const WithTextFieldActivator: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Cliquez sur le champ pour ouvrir"
						format="DD/MM/YYYY"
						useCombinedMode
						textFieldActivator
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
				</script>
				`,
			},
		],
	},
	args: {
		placeholder: 'Cliquez sur le champ pour ouvrir',
		format: 'DD/MM/YYYY',
		useCombinedMode: true,
		textFieldActivator: true,
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
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>Le calendrier s'ouvre au clic sur l'ensemble du champ.</p>
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
						<h3>Démonstration de l'auto clamp avec différents formats</h3>
						
						<h4 class="mt-4">Format JJ/MM/AAAA (séparateur /)</h4>
						<DatePicker
							v-model="dateSlash"
							placeholder="Saisie avec auto clamp - séparateur /"
							format="DD/MM/YYYY"
							useCombinedMode
							autoClamp
						/>
						
						<h4 class="mt-4">Format JJ-MM-AAAA (séparateur -)</h4>
						<DatePicker
							v-model="dateDash"
							placeholder="Saisie avec auto clamp - séparateur -"
							format="DD-MM-YYYY"
							useCombinedMode
							autoClamp
						/>
						
						<h4 class="mt-4">Format AAAA.MM.JJ (séparateur .)</h4>
						<DatePicker
							v-model="dateDot"
							placeholder="Saisie avec auto clamp - séparateur ."
							format="YYYY.MM.DD"
							useCombinedMode
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
				return { dateSlash, dateDash, dateDot }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <h3>Démonstration de l'auto clamp avec différents formats</h3>
                <div class="mb-4 mt-2">Saisissez uniquement des chiffres - les séparateurs seront ajoutés automatiquement selon le format défini</div>
                
                <h4 class="mb-2">Format JJ/MM/AAAA (séparateur /)</h4>
                <DatePicker
                  v-model="dateSlash"
                  placeholder="Saisie avec auto clamp - séparateur /"
                  format="DD/MM/YYYY"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateSlash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format JJ-MM-AAAA (séparateur -)</h4>
                <DatePicker
                  v-model="dateDash"
                  placeholder="Saisie avec auto clamp - séparateur -"
                  format="DD-MM-YYYY"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format AAAA.MM.JJ (séparateur .)</h4>
                <DatePicker
                  v-model="dateDot"
                  placeholder="Saisie avec auto clamp - séparateur ."
                  format="YYYY.MM.DD"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDot || 'aucune date saisie' }}</div>
              </div>
            `,
		}
	},
}

export const WithFormSubmission: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<form @submit.prevent="submitForm">
						<DatePicker
							ref="datePicker"
							v-model="date"
							placeholder="Date requise"
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
			components: { DatePicker },
			setup() {
				const date = ref('')
				// Définir le type correct pour la référence datePicker
				const datePicker = ref<InstanceType<typeof DatePicker> | null>(null)
				const submitted = ref(false)

				const submitForm = () => {
					if (!datePicker.value) return
					const isValid = datePicker.value.validateOnSubmit()
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
                    placeholder="Date requise"
                    format="DD/MM/YYYY"
                    required
                    class="mb-4"
					useCombinedMode
                  />
                  <v-btn type="submit" color="primary">Soumettre</v-btn>
                </form>
                <div v-if="submitted" class="mt-4 success--text">
                  Formulaire soumis avec la date: {{ date }}
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
							placeholder="Date requise"
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

				// Valeur du DatePicker
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
						label="Date de rendez-vous"
				placeholder="JJ/MM/AAAA"
			/>
				</div>
			`,
		}
	},
}

export const CustomWarningRules: Story = {
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
								// check typeof value
								if (typeof value === 'string') {
									return !value.includes('2025')
								}
								else {
									// check if value is a Date
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

				// Valeur du DatePicker
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
						label="Date de rendez-vous"
						placeholder="JJ/MM/AAAA"
				/>
				</div>
			`,
		}
	},

}
