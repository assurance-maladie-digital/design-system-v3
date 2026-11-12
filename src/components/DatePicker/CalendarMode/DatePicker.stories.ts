import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from './DatePicker.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { ref, computed } from 'vue'
import { fn } from 'storybook/test'
import { createInfoNotice, createInfoNoticeDecorator } from '@/stories/InfoNotice/InfoNotice'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

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
		'headingLevel': {
			control: { type: 'select' },
			options: [1, 2, 3, 4, 5, 6],
		},
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
		'label': {
			control: 'text',
			description: 'Libellé du champ affiché au-dessus de l\'input. RGAA 11.1 et 11.2 : utiliser un intitulé court, explicite et distinct pour chaque champ (ex : « Date de naissance »). Ne pas y répéter le format attendu : en mode saisie (combiné ou `noCalendar`), l\'indiquer dans `helpText` ; en mode calendrier seul, il n\'est pas nécessaire.',
			defaultValue: 'Date',
		},
		'helpText': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ, y compris en cas d\'erreur (comme `SyTextField`). Utile pour une précision métier (ex : où trouver la date) ; l\'indication du format attendu n\'est nécessaire qu\'en mode saisie (combiné ou `noCalendar`), pas en mode calendrier seul où l\'utilisateur ne tape pas (RGAA 11.1, 11.2).',
		},
		'hint': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ et relié à celui-ci par `aria-describedby`. À utiliser avec `persistentHint`. Il est masqué dès qu\'un message est affiché : préférer `helpText` pour une contrainte métier ou, en mode saisie, le format attendu (RGAA 11.1).',
		},
		'persistentHint': {
			control: 'boolean',
			description: 'Garde le `hint` visible en permanence (sinon il n\'apparaît qu\'au focus).',
			defaultValue: false,
		},
		'placeholder': {
			control: 'text',
			description: 'Exemple de saisie affiché lorsque le champ est vide. Il ne remplace jamais le libellé ni le `helpText` (RGAA 11.1, 11.2).',
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
		'validateWithReturnFormat': {
			control: 'boolean',
			description: 'Opt-in : transmet au `validate` des règles personnalisées la saisie au format `dateFormatReturn` (comme le v-model) au lieu du format d\'affichage. Désactivé par défaut.',
			defaultValue: false,
		},
		'isBirthDate': {
			control: 'boolean',
			description: 'Active le mode date de naissance qui ouvre le calendrier sur la vue de sélection d\'année (au lieu de la vue mensuelle), permettant une navigation année → mois → jour',
			defaultValue: false,
		},
		'birthDate': {
			control: 'boolean',
			description: '⚠️ **DEPRECATED** — Utilisez `isBirthDate` à la place.',
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
			defaultValue: false,
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
						label="Date de la consultation"
						help-text="Ouvre un calendrier pour choisir la date"
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
		'headingLevel': 3,
		'label': 'Date de la consultation',
		'helpText': 'Ouvre un calendrier pour choisir la date',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
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
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date de début de votre arrêt de travail"
						help-text="Cette date figure sur votre prescription médicale"
						placeholder="JJ/MM/AAAA"
						format="DD/MM/YYYY"
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

					const date = ref<string | null>(null)
				</script>
				`,
			},
		],
	},
	args: {
		...Default.args,
		label: 'Date de début de votre arrêt de travail',
		helpText: 'Cette date figure sur votre prescription médicale',
		clearable: false,
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<p>Les champs marqués d'un astérisque (*) sont obligatoires.</p>
					<DatePicker
						v-model="date1"
						label="Date de la consultation"
						required
						format="DD/MM/YYYY"
					  />
					  	<DatePicker
						v-model="date2"
						label="Date de l'ordonnance"
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
		'headingLevel': 3,
		'label': 'Date de la consultation',
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
				const value1 = ref('')
				const value2 = ref('')
				return { args, value1, value2 }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
				<p class="mb-4 w-100">Les champs marqués d'un astérisque (*) sont obligatoires.</p>
				<h4 class="mb-4">Sans astérisque :</h4>
                <DatePicker v-bind="args" v-model="value1"/>
				<h4 class="mb-4">Avec astérisque :</h4>
				<DatePicker v-bind="args" v-model="value2" label="Date de l'ordonnance" displayAsterisk/>
				<div class="mt-4 text-body-2">Valeur 1 : {{ value1 }} | Valeur 2 : {{ value2 }}</div>
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
						label="Période d'hospitalisation"
						help-text="Sélectionnez la date de début puis la date de fin dans le calendrier"
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
		'headingLevel': 3,
		'label': 'Période d\'hospitalisation',
		'helpText': 'Sélectionnez la date de début puis la date de fin dans le calendrier',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
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
						label="Date de la consultation"
						help-text="Dates sélectionnables du 01/01/1995 au 31/12/2005"
						format="DD/MM/YYYY"
						:period="{
							min: '01/01/1995',
							max: '31/12/2005',
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
		'headingLevel': 3,
		'label': 'Date de la consultation',
		'helpText': 'Dates sélectionnables du 01/01/1995 au 31/12/2005',
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
			max: '31/12/2005',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
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
						label="Date de la consultation"
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
		'headingLevel': 3,
		'label': 'Date de la consultation',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
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
						label="Date de la consultation"
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
		'headingLevel': 3,
		'label': 'Date de la consultation',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
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
						placeholder="JJ/MM/AAAA"
						label="Date de la consultation"
						format="DD/MM/YYYY"
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
		placeholder: 'JJ/MM/AAAA',
		label: 'Date de la consultation',
		format: 'DD/MM/YYYY',
		clearable: false,
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('01/01/2025')
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
						label="Date de naissance"
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
		'headingLevel': 3,
		'label': 'Date de naissance',
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
                <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
              </div>
            `,
		}
	},
}

export const UTC: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div>
						<DatePicker
							v-model="dateString"
							label="Date de la consultation"
							format="DD/MM/YYYY"
						/>

						<p class="mt-4" style="font-family: monospace;">timezone sélectionné : {{ selectedTimeZone }}</p>
						<p style="font-family: monospace;">v-model (DD/MM/YYYY) : {{ dateString }}</p>
						<p style="font-family: monospace;">Date ISO (UTC) : {{ utcIso }}</p>
						<p style="font-family: monospace;">Date affichée dans le timezone sélectionné : {{ dateInSelectedTimeZone }}</p>
						<p style="font-family: monospace;">Date affichée dans Europe/Paris : {{ dateInParis }}</p>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { computed, ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					import dayjs from 'dayjs'
					import customParseFormat from 'dayjs/plugin/customParseFormat'
					import utc from 'dayjs/plugin/utc'
					import timezone from 'dayjs/plugin/timezone'
					
					dayjs.extend(customParseFormat)
					dayjs.extend(utc)
					dayjs.extend(timezone)

					const DISPLAY_FORMAT = 'DD/MM/YYYY'
					const selectedTimeZone = ref<'America/Guadeloupe'>('America/Guadeloupe')
					const utcIso = ref('2023-01-15T00:00:00.000Z')
					
					// Un seul computed avec getter/setter pour gérer l'intégration timezone:
					// - getter: ISO UTC -> DD/MM/YYYY en timezone
					// - setter: DD/MM/YYYY en timezone -> ISO UTC
					const dateString = computed({
						get() {
							return dayjs.utc(utcIso.value).tz(selectedTimeZone.value).format(DISPLAY_FORMAT)
						},
						set(v: string) {
							const parsed = dayjs.tz(v, DISPLAY_FORMAT, selectedTimeZone.value)
							if (!parsed.isValid() || parsed.format(DISPLAY_FORMAT) !== v) return
							utcIso.value = parsed.utc().toISOString()
						},
					})
					
					const dateInSelectedTimeZone = computed(() => {
						return dayjs.utc(utcIso.value)
							.tz(selectedTimeZone.value)
							.format('DD/MM/YYYY')
					})

					const dateInParis = computed(() => {
						return dayjs.utc(utcIso.value)
							.tz('Europe/Paris')
							.format('DD/MM/YYYY')
					})
					
				</script>
				`,
			},
		],
	},
	args: {
		'headingLevel': 3,
		'label': 'Date de la consultation',
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
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClosed': fn(),
	},
	render(args) {
		return {
			components: { DatePicker, SyAlert },
			setup() {
				dayjs.extend(customParseFormat)
				dayjs.extend(utc)
				dayjs.extend(timezone)

				const DISPLAY_FORMAT = computed(() => args.format ?? 'DD/MM/YYYY')
				const selectedTimeZone = ref<'America/Guadeloupe'>('America/Guadeloupe')
				const utcIso = ref('2023-01-15T00:00:00.000Z')

				const dateString = computed({
					get() {
						return dayjs.utc(utcIso.value).format(DISPLAY_FORMAT.value)
					},
					set(v: string) {
						const parsed = dayjs.utc(v, DISPLAY_FORMAT.value, true)
						if (!parsed.isValid() || parsed.format(DISPLAY_FORMAT.value) !== v) return
						utcIso.value = dayjs.utc()
							.year(parsed.year())
							.month(parsed.month())
							.date(parsed.date())
							.hour(0)
							.minute(0)
							.second(0)
							.millisecond(0)
							.toISOString()
						args['onUpdate:modelValue']?.(v)
					},
				})

				const dateInSelectedTimeZone = computed(() => {
					return dayjs.utc(utcIso.value)
						.tz(selectedTimeZone.value)
						.format('DD/MM/YYYY')
				})

				const dateInParis = computed(() => {
					return dayjs.utc(utcIso.value)
						.tz('Europe/Paris')
						.format('DD/MM/YYYY')
				})

				return { args, dateString, utcIso, selectedTimeZone, dateInSelectedTimeZone, dateInParis }
			},
			template: `
				<div class="d-flex flex-column gap-4 pa-4">
					<SyAlert type="info" variant="tonal" class="mb-6">
						Selon le timezone, une même date UTC peut correspondre à un jour différent en local.
					</SyAlert>
					<DatePicker v-model="dateString" v-bind="args" />
					<div class="mt-4" style="font-family: monospace;">
						<div>timezone sélectionné : {{ selectedTimeZone }}</div>
						<div>v-model (DD/MM/YYYY) : {{ dateString }}</div>
						<div>Date ISO (UTC) : {{ utcIso }}</div>
						<div>Date affichée dans le timezone sélectionné : {{ dateInSelectedTimeZone }}</div>
						<div>Date affichée dans Europe/Paris : {{ dateInParis }}</div>
					</div>
				</div>
			`,
		}
	},
}

export const AccessibilityNotice = createInfoNotice(`
	<p>
		<strong>Le calendrier doit être un moyen alternatif, optionnel de saisir une date.</strong>
	</p>
	<p>
		Afin de garantir à tous la possibilité de remplir la date, mettre à disposition un champ de saisie
		textuel, avec la possibilité additionnelle et non obligatoire d'utiliser le calendrier.
	</p>
	<p>
		Options disponibles : le <strong>mode combiné</strong>
		(<a class="text-primary" href="/?path=/docs/composants-formulaires-datepicker-combinedmode--docs"><code>CombinedMode</code></a>, prop
		<code>useCombinedMode</code>) qui associe saisie textuelle et calendrier, ou le
		<strong>mode saisie manuelle</strong>
		(<a class="text-primary" href="/?path=/docs/composants-formulaires-datepicker-dateinput--docs"><code>DateInput</code></a>, prop <code>noCalendar</code>) sans calendrier.
	</p>
`)
