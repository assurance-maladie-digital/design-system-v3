import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { ref, onMounted } from 'vue'
import { fn } from 'storybook/test'
import type { CalendarModeProps } from '../types'

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
			description: 'Active le mode date de naissance qui ouvre le calendrier sur la vue de sélection d\'année (au lieu de la vue mensuelle), permettant une navigation année → mois → jour',
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
			description: 'Règles de validation personnalisées pour la date saisie (DatePickerRule[]), affichant des erreurs si non respectées',
			defaultValue: [],
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées (DatePickerRule[]) pour afficher des messages d\'attention sans bloquer la validation',
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
			defaultValue: false,
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
			description: '⚠️ **DEPRECATED** — Utilisez `isBirthDate` à la place.',
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
		'errors': {
			description: 'Tableau réactif contenant tous les messages d\'erreur. Combine les erreurs injectées via errorMessages et celles générées par la validation. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: 'Readonly<Ref<string[]>>' },
				category: 'expose',
			},
		},
		'warnings': {
			description: 'Tableau réactif contenant tous les messages d\'avertissement. Combine les avertissements injectés via warningMessages et ceux générés par customWarningRules. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: 'Readonly<Ref<string[]>>' },
				category: 'expose',
			},
		},
		'successes': {
			description: 'Tableau réactif contenant tous les messages de succès. Combine les succès injectés via successMessages et ceux générés par customSuccessRules. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: 'Readonly<Ref<string[]>>' },
				category: 'expose',
			},
		},
	},
} as Meta<CalendarModeProps & {
	'onUpdate:modelValue'?: (value: DateModelValue) => void
	'onFocus'?: () => void
	'onBlur'?: () => void
	'onClosed'?: () => void
	'onInput'?: (value: string) => void
	'onDate-selected'?: (value: DateModelValue) => void
}>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Utilisation basique du DatePicker en mode combiné, permettant à la fois la saisie manuelle et la sélection via calendrier.',
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

export const Required: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Champ obligatoire avec et sans astérisque, et comparaison de `isValidateOnBlur` à true (par défaut) et false.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date1"
						label="Date (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
						useCombinedMode
						required
						format="DD/MM/YYYY"
					/>	
					<DatePicker
						v-model="date2"
						label="Date (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
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

					const date1 = ref('')
					const date2 = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		'label': 'Date (JJ/MM/AAAA)',
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
				const value1 = ref('')
				const value2 = ref('')
				return { args, value1, value2 }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
				<h4 class="mb-4">Sans astérisque & isValidateOnBlur à true (par defaut):</h4>
                <DatePicker v-bind="args" v-model="value1"/>
				<h4 class="mb-4">Avec astérisque & isValidateOnBlur à false:</h4>
				<DatePicker v-bind="args" displayAsterisk  v-model="value2" :isValidateOnBlur='false'/>
				<div class="mt-4 text-body-2">Valeur 1 : {{ value1 }} | Valeur 2 : {{ value2 }}</div>
              </div>
            `,
		}
	},
}

export const DateRange: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Sélection d\'une plage de dates (date début - date fin) avec `displayRange`. Le v-model retourne un tableau de deux dates.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="dateRange"
						label="Période (JJ/MM/AAAA - JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
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
		'label': 'Période (JJ/MM/AAAA - JJ/MM/AAAA)',
		'placeholder': 'JJ/MM/AAAA - JJ/MM/AAAA',
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
				const value = ref(['2023-01-15', '2023-01-20'] as [string, string] | null)
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

export const BirthDate: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Mode date de naissance avec `isBirthDate`, ouvrant le calendrier sur la vue année pour une navigation année → mois → jour.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date de naissance (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
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
		label: 'Date de naissance (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const DisablePickerInteraction: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `noCalendar: true`, le calendrier est désactivé. Seule la saisie manuelle avec formatage automatique est disponible.',
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
		label: 'Date (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
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

export const ReadonlyMode: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Mode lecture seule avec `readonly`, empêchant toute modification de la valeur par l\'utilisateur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date en lecture seule (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
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
		label: 'Date en lecture seule (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
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
		docs: {
			description: {
				story: 'Positionnement de l\'icône calendrier à la fin du champ avec `displayAppendIcon` et `displayPrependIcon: false`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date avec icône à la fin (JJ/MM/AAAA)"
						placeholder="JJ/MM/AAAA"
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
		label: 'Date avec icône à la fin (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
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
		docs: {
			description: {
				story: 'Période personnalisée avec `period` (min/max) et `customRules` pour valider les saisies manuelles hors période.',
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
		label: 'Date (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
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
