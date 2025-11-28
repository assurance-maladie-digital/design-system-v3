import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from './DatePicker.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { ref, watch, computed } from 'vue'
import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/DatePicker/CalendarMode',
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
				component: '\n## DatePicker - Incompatibilités entre props\n\n### Contrôle d\'affichage des icônes\n- `noIcon: true` masque toutes les icônes, rendant `displayIcon`, `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayIcon: false` désactive les icônes, rendant `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayAppendIcon` et `displayPrependIcon` sont mutuellement exclusifs; si les deux sont définis à `true`, `displayAppendIcon` est prioritaire\n\n### Modes de fonctionnement\n- `noCalendar` et `useCombinedMode` sont mutuellement exclusifs\n- `noCalendar: true` rend sans effet : `displayWeekendDays`, `displayHolidayDays`, `showWeekNumber` et `textFieldActivator`\n\n### Validation et états de champ\n- `readonly: true` désactive toutes les validations, y compris `required` et les règles personnalisées\n- `disabled` et `readonly` sont mutuellement exclusifs\n- `disableErrorHandling: true` peut créer une incohérence avec `showSuccessMessages: true`\n\n### Format et saisie\n- `birthDate` et `isBirthDate` sont des alias, utiliser l\'un ou l\'autre mais pas les deux\n- `displayRange: true` nécessite que modelValue soit un tableau de deux dates `[startDate, endDate]`\n- `autoClamp: true` peut court-circuiter certaines validations manuelles\n',
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
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'onDate-selected': {
			description: 'Émis lorsqu\'une date est sélectionnée dans le calendrier',
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
			description: 'Dates sélectionnées au format Date (peut être un tableau en mode plage)',
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
		'initializeSelectedDates': {
			description: 'Initialise les dates sélectionnées à partir de valeurs fournies',
			table: {
				category: 'exposed',
				type: { summary: '(value: DateInput | null, format: string, returnFormat?: string) => Date | Date[] | null' },
			},
		},
		'updateAccessibility': {
			description: 'Met à jour les attributs d\'accessibilité du composant',
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
		'modelValue': {
			control: 'text',
			description: 'Valeur du champ (v-model), peut être une chaîne de caractères ou un tableau de deux dates en mode plage',
		},
		'placeholder': {
			control: 'text',
			description: 'Texte indicatif affiché lorsque le champ est vide pour guider l\'utilisateur sur le format attendu',
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
		'birthDate': {
			control: 'boolean',
			description: 'Alias pour isBirthDate (pour compatibilité avec l\'attribut kebab-case birth-date dans les templates). ⚠️ Utiliser soit birthDate soit isBirthDate, mais pas les deux.',
			defaultValue: false,
		},
		'isOutlined': {
			control: 'boolean',
			description: 'Affiche le champ avec un contour complet (style outlined de Vuetify) plutôt qu\'un souligné simple',
			defaultValue: true,
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
			description: 'Désactive l\'affichage du calendrier, permettant uniquement la saisie manuelle (utile pour les tests automatisés, copier-coller et robots). ⚠️ Incompatible avec useCombinedMode, displayWeekendDays, displayHolidayDays, showWeekNumber et textFieldActivator.',
			defaultValue: false,
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
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ, affecte l\'espacement interne et la hauteur (standard Vuetify)',
			defaultValue: 'default',
		},
		'hideDetails': {
			control: 'select',
			options: [true, false, 'auto'],
			description: 'Contrôle l\'affichage des messages d\'erreur et de validation sous le champ (true=masqués, false=toujours affichés, auto=affichés si nécessaire)',
			defaultValue: false,
		},
		'displayWeekendDays': {
			control: 'boolean',
			description: 'Affiche les jours de week-end avec un style spécifique pour les distinguer dans le calendrier. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: true,
		},
		'displayTodayButton': {
			control: 'boolean',
			description: 'Affiche le bouton "Aujourd\'hui" en bas du calendrier pour sélectionner rapidement la date du jour',
			defaultValue: true,
		},
		'displayHolidayDays': {
			control: 'boolean',
			description: 'Affiche les jours fériés français avec un style spécifique dans le calendrier. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: true,
		},
		'useCombinedMode': {
			control: 'boolean',
			description: 'Active le mode combiné permettant à la fois la sélection via calendrier et la saisie manuelle de date. ⚠️ Incompatible avec noCalendar.',
			defaultValue: false,
		},
		'textFieldActivator': {
			control: 'boolean',
			description: 'Permet d\'ouvrir le calendrier en cliquant n\'importe où sur le champ texte, pas uniquement sur l\'icône. ⚠️ Sans effet si noCalendar est true.',
			defaultValue: false,
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque (*) à côté du label pour indiquer visuellement que le champ est obligatoire',
			defaultValue: false,
		},
		'autoClamp': {
			control: 'boolean',
			description: 'Active la mise en forme automatique lors de la saisie (ajout des séparateurs automatiquement). ⚠️ Peut court-circuiter certaines validations manuelles.',
			defaultValue: false,
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Active la validation automatique lorsque le champ perd le focus (onBlur)',
			defaultValue: true,
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
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'displayHolidayDays': true,
		'modelValue': '',
		'displayTodayButton': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
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
						required
						format="DD/MM/YYYY"
					  />
					  	<DatePicker
						v-model="date"
						placeholder="Sélectionner une date"
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
		'required': true,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'displayHolidayDays': true,
		'modelValue': '',
		'displayTodayButton': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
				<h4 class="mb-4">Sans astérisque :</h4>
                <DatePicker v-bind="args" v-model="value"/>
				<h4 class="mb-4">Avec astérisque :</h4>
				<DatePicker v-bind="args" v-model="value" displayAsterisk/>
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
		'placeholder': 'Sélectionner une période',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': ['', ''],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
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

export const WithCustomPeriod: Story = {
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
						:period="{
							min: '01/01/1995',
							max: '12/31/2005',
						}"
						:customRules="[
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
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePicker } from '@cnamts/synapse'
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
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '',
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
		'period': {
			min: '01/01/1995',
			max: '12/31/2005',
		},
		'customRules': [
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
			components: { DatePicker: DatePicker, SyAlert },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
			<div style="margin-bottom: 20px; padding: 15px;"> 
				<SyAlert variant="tonal" :closable="false">
					<template #default>
					<p>La propriété <strong>period</strong> limite les dates sélectionnables dans le calendrier</p>
					<p>Ouvrez les années dans le calendrier pour voir les dates limites</p>
					</template>
				</SyAlert>
			</div>
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
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
						placeholder="Sélectionner une date"
						format="DD/MM/YYYY"
						displayAppendIcon
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
		'placeholder': 'Sélectionner une date',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': true,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '',
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
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

export const WithoutIcon: Story = {
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
						:displayIcon="false"
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
		'placeholder': 'Sélectionner une date',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': false,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '',
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
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

export const BirthDate: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="birthDate"
						placeholder="Date de naissance"
						format="DD/MM/YYYY"
						isBirthDate
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
					
					const birthDate = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Date de naissance',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': true,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '',
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
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

export const WithError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="notAfterToday"
						:custom-rules="[
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd'hui' } },
		]"
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
					
					const date = ref('01/01/2100')
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Sélectionner une date',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '01/01/2100',
		'customRules': [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd hui' } },
		],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('01/01/2100')
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

export const WithWarning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date avec avertissement"
						:custom-warning-rules="[
							{ type: 'notBeforeDate', options: { 
								warningMessage: 'Attention : la date est antérieure à la date de référence',
								date: '01/01/2031',
								isWarning: true,
							} }
						]"
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
					
					const date = ref('20/12/2023')
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Date avec avertissement',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '20/12/2023',
		'customWarningRules': [
			{
				type: 'notBeforeDate', options: {
					warningMessage: 'Attention : la date est antérieure à la date de référence',
					date: '01/01/2024',
					isWarning: true,
				},
			},
		],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('20/12/2023')
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

export const WithSuccess: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date valide"
						required
						:custom-rules="[
							{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } }
						]"
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
					
					const date = ref('22/01/2024')
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Date valide',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': true,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '22/01/2024',
		'customRules': [
			{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } },
		],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('22/01/2024')
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
					<div class="d-flex flex-column gap-4">
						<DatePicker
							v-model="value1"
							placeholder="Format JJ/MM/AAAA"
							format="DD/MM/YYYY"
						/>
						<DatePicker
							v-model="value2"
							placeholder="Format MM/JJ/AAAA"
							format="MM/DD/YYYY"
						/>
						<DatePicker
							v-model="value3"
							placeholder="Format AAAA-MM-JJ"
							format="YYYY-MM-DD"
						/>
						<DatePicker
							v-model="value4"
							placeholder="Format JJ-MM-AA"
							format="DD-MM-YY"
						/>
						<DatePicker
							v-model="value5"
							placeholder="Format JJ.MM.AAAA"
							format="DD.MM.YYYY"
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
                    placeholder="Format JJ/MM/AAAA"
                    format="DD/MM/YYYY"
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="Format MM/JJ/AAAA"
                    format="MM/DD/YYYY"
					class="py-4"
                />
                <DatePicker
                    v-model="value3"
                    placeholder="Format YYYY-MM-DD"
                    format="YYYY-MM-DD"
					class="py-4"
                />
                <DatePicker
                    v-model="value4"
                    placeholder="Format DD-MM-YY"
                    format="DD-MM-YY"
					class="py-4"
                />
                <DatePicker
                    v-model="value5"
                    placeholder="Format DD.MM.YYYY"
                    format="DD.MM.YYYY"
					class="py-4"
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
              <div class="d-flex flex-column gap-4 pa-4">
                <span class="mb-4">Date de retour : {{ value1 }}</span>
                <DatePicker
                    v-model="value1"
                    placeholder="Format JJ/MM/AAAA, retour par défaut"
                    format="DD/MM/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value2 }}</span>
                <DatePicker
                    v-model="value2"
                    placeholder="Format JJ/MM/AAAA, retour MM/DD/YYYY"
                    format="DD/MM/YYYY"
                    date-format-return="MM/DD/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format JJ/MM/AAAA, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    date-format-return="YYYY-MM-DD"
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
					const value2 = ref('25/12/2025')
					const value3 = ref('26/12/2025')
				</script>
				`,
			},
		],
	},
	args: {
		'placeholder': 'Sélectionner une date',
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'isBirthDate': false,
		'showWeekNumber': false,
		'required': false,
		'displayRange': false,
		'displayIcon': true,
		'displayAppendIcon': false,
		'disabled': false,
		'noIcon': false,
		'noCalendar': false,
		'modelValue': '24/12/2025',
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render: () => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value1 = ref('24/12/2025')
				const value2 = ref('25/12/2025')
				const value3 = ref('26/12/2025')
				return { value1, value2, value3 }
			},
			template: `
              <div class="d-flex flex-column gap-4 pa-4">
                <span class="mb-4">Date de retour : {{ value1 }}</span>
                <DatePicker
                    v-model="value1"
                    placeholder="Format JJ/MM/AAAA, retour par défaut"
                    format="DD/MM/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value2 }}</span>
                <DatePicker
                    v-model="value2"
                    placeholder="Format JJ/MM/AAAA, retour MM/DD/YYYY"
                    format="DD/MM/YYYY"
					date-format-return="MM/DD/YYYY"
                />


                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format JJ/MM/AAAA, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
					date-format-return="YYYY-MM-DD"
                />
              </div>
            `,
		}
	},
}

export const WithDayjsFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div>
						<DatePicker
							v-model="date"
							placeholder="Sélectionner une date"
							format="DD/MM/YYYY"
						/>
						<p class="mt-4">Date formatée avec dayjs: {{ formattedDate }}</p>
						<p>Date parsée avec dayjs: {{ parsedDate ? parsedDate.toLocaleDateString() : 'Aucune date' }}</p>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref, watch } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					import { useDateFormat } from '@cnamts/synapse'

					const { parseDate, formatDate } = useDateFormat()

					const date = ref('')
					const formattedDate = ref('')
					const parsedDate = ref<Date | null>(null)

					watch(date, (newDate) => {
						if (newDate) {
							parsedDate.value = parseDate(newDate, 'DD/MM/YYYY')
							if (parsedDate.value) {
								formattedDate.value = formatDate(parsedDate.value, 'YYYY-MM-DD')
							}
						} else {
							formattedDate.value = ''
							parsedDate.value = null
						}
					})
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
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '',
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				// Importer le composable useDateFormat depuis useDateFormatDayjs
				const { parseDate, formatDate } = useDateFormat()

				const date = ref('')
				const formattedDate = ref('')
				const parsedDate = ref<Date | null>(null)

				watch(date, (newDate) => {
					if (newDate) {
						parsedDate.value = parseDate(newDate, 'DD/MM/YYYY')
						if (parsedDate.value) {
							formattedDate.value = formatDate(parsedDate.value, 'YYYY-MM-DD')
						}
					}
					else {
						formattedDate.value = ''
						parsedDate.value = null
					}
				})

				return { date, formattedDate, parsedDate }
			},

			template: `
				<div class="pa-4">
					<DatePicker
						v-model="date"
						placeholder="Sélectionner une date"
						format="DD/MM/YYYY"
					/>
					<p class="mt-4">Date formatée avec dayjs: {{ formattedDate }}</p>
					<p>Date parsée avec dayjs: {{ parsedDate ? parsedDate.toLocaleDateString() : 'Aucune date' }}</p>
				</div>
			`,
		}
	},
}

export const BidirectionalValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="date-validation-playground">
						<h1>Validation bidirectionnelle des dates</h1>
						<p class="description">
							Démonstration de la validation bidirectionnelle entre les DatePickers.
							Les messages d'erreur apparaissent directement dans les composants.
						</p>
						<div class="date-range-container">
							<div class="date-picker-wrapper">
								<h3>Date de début</h3>
								<DatePicker
									ref="startDatePickerRef"
									v-model="startDate"
									placeholder="Date de début"
									:custom-rules="startDateRules"
									required
									@update:model-value="validateEndDate"
								/>
							</div>
							<div class="date-picker-wrapper">
								<h3>Date de fin</h3>
								<DatePicker
									ref="endDatePickerRef"
									v-model="endDate"
									placeholder="Date de fin"
									:custom-rules="endDateRules"
									required
									@update:model-value="validateStartDate"
								/>
							</div>
						</div>
						<div class="current-values">
							<p><strong>Date de début:</strong> {{ startDate || 'Non sélectionnée' }}</p>
							<p><strong>Date de fin:</strong> {{ endDate || 'Non sélectionnée' }}</p>
						</div>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script lang="ts" setup>
					import { ref, watch, computed } from 'vue'
					import DatePicker from '@cnamts/synapse'
					import { useDateFormat } from '@cnamts/synapse'

					const { parseDate } = useDateFormat()

					// État des dates
					const startDate = ref<string | null>(null)
					const endDate = ref<string | null>(null)

					// Références aux composants CalendarMode pour accéder à leurs méthodes
					const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
					const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

					// Règle de validation pour vérifier que la date de fin n'est pas avant la date de début
					const createEndDateValidationRule = () => ({
						type: 'custom',
						options: {
							validate: (value: string) => {
								// Si pas de valeur pour la date de fin, pas besoin de validation
								if (!value) return true

								// Si pas de date de début mais une date de fin, afficher l'erreur
								if (!startDate.value) return 'Veuillez d'abord sélectionner une date de début'

								const start = parseDate(startDate.value, 'DD/MM/YYYY')
								const end = parseDate(value, 'DD/MM/YYYY')

								if (!start || !end) return true

								return end >= start || 'La date de fin ne peut pas être antérieure à la date de début'
							},
							message: 'La date de fin ne peut pas être antérieure à la date de début',
						},
					})

					// Règle de validation pour vérifier que la date de début n'est pas après la date de fin
					const createStartDateValidationRule = () => ({
						type: 'custom',
						options: {
							validate: (value: string) => {
								// Si pas de valeur pour la date de début ou pas de date de fin, pas besoin de validation
								if (!value || !endDate.value) return true

								const start = parseDate(value, 'DD/MM/YYYY')
								const end = parseDate(endDate.value, 'DD/MM/YYYY')

								if (!start || !end) return true

								return start <= end || 'La date de début ne peut pas être postérieure à la date de fin'
							},
							message: 'La date de début ne peut pas être postérieure à la date de fin',
						},
					})

					// Règles de validation pour la date de début
					const startDateRules = computed(() => [
						{
							type: 'required',
							options: {
								message: 'La date de début est requise.',
							},
						},
						createStartDateValidationRule(),
					])

					// Règles de validation pour la date de fin
					const endDateRules = computed(() => [
						{
							type: 'required',
							options: {
								message: 'La date de fin est requise.',
							},
						},
						createEndDateValidationRule(),
					])

					// Fonction pour forcer la validation de la date de fin quand la date de début change
					const validateEndDate = () => {
						if (endDatePickerRef.value && endDate.value) {
							// On utilise validateOnSubmit pour forcer la validation complète
							endDatePickerRef.value.validateOnSubmit()
						}
					}

					// Fonction pour forcer la validation de la date de début quand la date de fin change
					const validateStartDate = () => {
						if (startDatePickerRef.value && startDate.value) {
							// On utilise validateOnSubmit pour forcer la validation complète
							startDatePickerRef.value.validateOnSubmit()
						}
					}

					// Watcher pour la date de début qui force la revalidation de la date de fin
					watch(startDate, () => {
						// Laisser le temps au système de mettre à jour les valeurs
						setTimeout(() => {
							validateEndDate()
						}, 0)
					})

					// Watcher pour la date de fin qui force la revalidation de la date de début
					watch(endDate, () => {
						// Laisser le temps au système de mettre à jour les valeurs
						setTimeout(() => {
							validateStartDate()
						}, 0)
					})
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				// Importer le composable useDateFormat depuis useDateFormatDayjs
				const { parseDate } = useDateFormat()

				// État des dates
				const startDate = ref<string | null>(null)
				const endDate = ref<string | null>(null)

				// Références aux composants CalendarMode pour accéder à leurs méthodes
				const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
				const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

				// Règle de validation pour vérifier que la date de fin n'est pas avant la date de début
				const createEndDateValidationRule = () => ({
					type: 'custom',
					options: {
						validate: (value: string) => {
							// Si pas de valeur pour la date de fin, pas besoin de validation
							if (!value) return true

							// Si pas de date de début mais une date de fin, afficher l'erreur
							if (!startDate.value) return 'Veuillez d\'abord sélectionner une date de début'

							const start = parseDate(startDate.value, 'DD/MM/YYYY')
							const end = parseDate(value, 'DD/MM/YYYY')

							if (!start || !end) return true

							return end >= start || 'La date de fin ne peut pas être antérieure à la date de début'
						},
						message: 'La date de fin ne peut pas être antérieure à la date de début',
					},
				})

				// Règle de validation pour vérifier que la date de début n'est pas après la date de fin
				const createStartDateValidationRule = () => ({
					type: 'custom',
					options: {
						validate: (value: string) => {
							// Si pas de valeur pour la date de début ou pas de date de fin, pas besoin de validation
							if (!value || !endDate.value) return true

							const start = parseDate(value, 'DD/MM/YYYY')
							const end = parseDate(endDate.value, 'DD/MM/YYYY')

							if (!start || !end) return true

							return start <= end || 'La date de début ne peut pas être postérieure à la date de fin'
						},
						message: 'La date de début ne peut pas être postérieure à la date de fin',
					},
				})

				// Règles de validation pour la date de début
				const startDateRules = computed(() => [
					{
						type: 'required',
						options: {
							message: 'La date de début est requise.',
						},
					},
					createStartDateValidationRule(),
				])

				// Règles de validation pour la date de fin
				const endDateRules = computed(() => [
					{
						type: 'required',
						options: {
							message: 'La date de fin est requise.',
						},
					},
					createEndDateValidationRule(),
				])

				// Fonction pour forcer la validation de la date de fin quand la date de début change
				const validateEndDate = () => {
					if (endDatePickerRef.value && endDate.value) {
						// On utilise validateOnSubmit pour forcer la validation complète
						endDatePickerRef.value.validateOnSubmit()
					}
				}

				// Fonction pour forcer la validation de la date de début quand la date de fin change
				const validateStartDate = () => {
					if (startDatePickerRef.value && startDate.value) {
						// On utilise validateOnSubmit pour forcer la validation complète
						startDatePickerRef.value.validateOnSubmit()
					}
				}

				// Watcher pour la date de début qui force la revalidation de la date de fin
				watch(startDate, () => {
					// Laisser le temps au système de mettre à jour les valeurs
					setTimeout(() => {
						validateEndDate()
					}, 0)
				})

				// Watcher pour la date de fin qui force la revalidation de la date de début
				watch(endDate, () => {
					// Laisser le temps au système de mettre à jour les valeurs
					setTimeout(() => {
						validateStartDate()
					}, 0)
				})

				return {
					startDate,
					endDate,
					startDatePickerRef,
					endDatePickerRef,
					startDateRules,
					endDateRules,
					validateEndDate,
					validateStartDate,
				}
			},

			template: `
				<div class="date-validation-playground">
					<h1>Validation bidirectionnelle des dates</h1>
					<p class="description">
						Démonstration de la validation bidirectionnelle entre les DatePickers.
						Les messages d'erreur apparaissent directement dans les composants.
					</p>
					<div class="date-range-container">
						<div class="date-picker-wrapper">
							<h3>Date de début</h3>
							<DatePicker
								ref="startDatePickerRef"
								v-model="startDate"
								placeholder="Date de début"
								:custom-rules="startDateRules"
								required
								@update:model-value="validateEndDate"
							/>
						</div>
						<div class="date-picker-wrapper">
							<h3>Date de fin</h3>
							<DatePicker
								ref="endDatePickerRef"
								v-model="endDate"
								placeholder="Date de fin"
								:custom-rules="endDateRules"
								required
								@update:model-value="validateStartDate"
							/>
						</div>
					</div>
					<div class="current-values">
						<p><strong>Date de début:</strong> {{ startDate || 'Non sélectionnée' }}</p>
						<p><strong>Date de fin:</strong> {{ endDate || 'Non sélectionnée' }}</p>
					</div>
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
					<v-form @submit.prevent="handleSubmit">
						<div style="display: flex; flex-direction: column; gap: 16px;">
							<div>
								<h3 class="mb-4">Avec calendrier</h3>
								<DatePicker
									ref="datePicker1"
									v-model="date1"
									required
									format="DD/MM/YYYY"
									placeholder="Date requise"
								/>
							</div>
							<div>
								<h3 class="mb-4">Sans calendrier</h3>
								<DatePicker
									ref="datePicker2"
									v-model="date2"
									required
									format="DD/MM/YYYY"
									placeholder="Date requise"
									no-calendar
								/>
							</div>
						</div>
						<button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
							Soumettre
						</button>
					</v-form>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'

					const datePicker1 = ref()
					const datePicker2 = ref()
					const date1 = ref('')
					const date2 = ref('')

					const handleSubmit = () => {
						const isValid1 = datePicker1.value?.validateOnSubmit()
						const isValid2 = datePicker2.value?.validateOnSubmit()
						
						if (!isValid1 || !isValid2) {
							alert('Corrigez les erreurs avant de soumettre !')
						} else {
							alert('Formulaire soumis avec succès !')
						}
					}
				</script>
				`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker1 = ref()
			const datePicker2 = ref()
			const date1 = ref('')
			const date2 = ref('')

			const handleSubmit = () => {
				const isValid1 = datePicker1.value?.validateOnSubmit()
				const isValid2 = datePicker2.value?.validateOnSubmit()

				if (!isValid1 || !isValid2) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return {
				datePicker1,
				datePicker2,
				date1,
				date2,
				handleSubmit,
			}
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<div style="display: flex; flex-direction: column; gap: 16px;">
						<div>
							<h3 class="mb-4">Avec soumission de formulaire:</h3>
							<DatePicker
								ref="datePicker1"
								v-model="date1"
								required
								format="DD/MM/YYYY"
								placeholder="Date requise"
							/>
						</div>
						<div>
							<h3 class="mb-4">Sans calendrier</h3>
							<DatePicker
								ref="datePicker2"
								v-model="date2"
								required
								format="DD/MM/YYYY"
								placeholder="Date requise"
								no-calendar
							/>
						</div>
					</div>
					<button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}
