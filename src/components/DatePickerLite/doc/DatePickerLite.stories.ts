import { fn } from 'storybook/test'
import { ref, watch } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta<typeof DatePickerLite> = {
	title: 'Composants/Formulaires/DatePickerLite',
	component: DatePickerLite,
	parameters: {
		docs: {
			description: {
				component: 'Sélecteur de date avec saisie libre et ouverture d’un sélecteur visuel. Le composant prend en charge la sélection au clavier, l’ouverture/fermeture, la validation et le comportement accessible sur les boutons de navigation du mois et de l’année.',
			},
			controls: {
				exclude: ['onUpdate:modelValue', 'onUpdate:open', 'onUpdate:view', 'onChange', 'onFocus', 'onBlur', 'onClear', 'onKeydown'],
			},
		},
		controls: {
			exclude: ['width', 'undefined', 'onUpdate:modelValue', 'onUpdate:open', 'onUpdate:view', 'onChange', 'onFocus', 'onBlur', 'onClear', 'onKeydown', 'slotName'],
		},
	},
	argTypes: {
		'locales': {
			description: 'Surcharge partielle des libellés et messages contextuels affichés par le composant. La prop accepte un objet dont seules les clés fournies remplacent les valeurs par défaut du fichier locales.ts.',
			control: 'object',
			table: {
				type: {
					summary: 'DeepPartial<typeof defaultLocales>',
					detail: `{
	monthSelectorLabel?: string,
	yearSelectorLabel?: string,
	yearBtnLabelSelected?: (selectedYear: string) => string,
	yearBtnLabelUnselected?: (selectedYear: string) => string,
	monthBtnLabelSelected?: (selectedMonth: string) => string,
	monthBtnLabelUnselected?: (selectedMonth: string) => string,
	previousMonthBtnLabel?: string,
	nextMonthBtnLabel?: string,
	btnLabel?: string,
	headerSelectDay?: string,
	todayBtnLabel?: string,
	todayBtnAriaLabel?: string,
	closeBtnLabel?: string,
	closeBtnAriaLabel?: string,
	fieldRequired?: (label?: string) => string,
}`,
				},
				category: 'props',
			},
		},
		...getValidationDocumentation('base'),
		'input': {
			description: 'Slot de remplacement du champ de saisie. Il reçoit le contexte de validation, le modèle et le bouton d’ouverture du sélecteur visuel pour conserver le comportement sans réécrire l’intégralité du composant.',
			control: false,
			table: {
				type: {
					summary: 'DatePickerLiteInputSlotProps',
					detail: `{
	mode: 'single' | 'range' | 'multiple',
	modelValue: Date | [Date, Date] | Date[] | undefined,
	updateModelValue: (value: Date | [Date, Date] | Date[] | undefined) => void,
	inputProps: DatePickerLiteInputProps, // props du champ + état de validation, à v-bind sur le champ personnalisé
	updateTextValue: (value: string | undefined) => void, // reporte le texte saisi pour la validation
	setFocused: (value: boolean) => void,
	toggleBtnRef: Ref<HTMLButtonElement | null>, // à attacher via :ref au bouton d'ouverture du sélecteur visuel
}`,
				},
				defaultValue: { summary: 'default input field' },
				category: 'slots',
			},
		},
		'menu': {
			description: 'Slot de remplacement complet du menu du sélecteur visuel. Reçoit la vue courante, la valeur sélectionnée et le contrôle d’ouverture pour personnaliser le contenu du calendrier.',
			control: false,
			table: {
				type: {
					summary: 'DatePickerLiteMenuSlotProps',
					detail: `{
	modelValue: Date | [Date, Date] | Date[] | undefined,
	view: 'days' | 'months' | 'years',
	readonly: boolean,
	disabled: boolean,
	isOpen: boolean,
	setOpen: (value: boolean) => void, // ex. setOpen(false) pour fermer après sélection
}`,
				},
				category: 'slots',
			},
		},
		'header': {
			description: 'Slot pour surcharger l’en-tête du calendrier. Reçoit la vue active, le mois courant, les bornes d’années et les callbacks de navigation au mois précédent et suivant.',
			control: false,
			table: {
				type: {
					summary: 'DatePickerLiteHeaderSlotProps',
					detail: `{
	view: 'days' | 'months' | 'years',
	modelValue: Date | undefined,
	currentMonth: Date,
	minYear: number,
	maxYear: number,
	previousMonth: () => void,
	nextMonth: () => void,
}`,
				},
				category: 'slots',
			},
		},
		'footer': {
			description: 'Slot pour ajouter un contenu d’action ou d’information au bas du sélecteur visuel.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'day': {
			description: 'Slot appliqué à chaque case du calendrier. Reçoit le jour courant ainsi que son état visuel (sélectionné, aujourd’hui, plage, etc.).',
			control: false,
			table: {
				type: {
					summary: 'FeaturedDaysInWeek',
					detail: `{
	rawDate: Date,
	day: number, // numéro du jour dans le mois
	ISO8601: string, // ex. '2025-10-15'
	isSelected: boolean,
	isToday: boolean,
	isWeekend: boolean,
	isPreviousMonth: boolean,
	isNextMonth: boolean,
	isRangeStart: boolean,
	isRangeEnd: boolean,
	isInRange: boolean,
	isPreviewed: boolean,
	isPreviewStart: boolean,
	isPreviewEnd: boolean,
}`,
				},
				category: 'slots',
			},
		},
		// Slot dynamique (day-YYYY-MM-DD) : la clé template-literal n'est pas préservée par ArgTypes, d'où le cast
		...({
			'`day-${date}"`': {
				description: 'Slot spécifique à une date donnée au format day-YYYY-MM-DD, utile pour mettre en avant un jour particulier (ex. : day-2025-10-15). Reçoit les mêmes props que le slot day.',
				control: false,
				table: {
					type: { summary: 'FeaturedDaysInWeek' },
					category: 'slots',
				},
			},
		} as Meta<typeof DatePickerLite>['argTypes']),
		'prepend': {
			description: 'Slot de contenu ajouté avant le champ de saisie pour intégrer un libellé, un badge ou un bouton contextualisé.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'append': {
			description: 'Slot de contenu ajouté après le champ de saisie, utile pour intégrer un bouton d’action ou un raccourci.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'prepend-inner': {
			description: 'Slot contenu à l’intérieur du champ, avant le texte saisi, pour insérer un indicateur ou un préfixe visuel.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'append-inner': {
			description: 'Slot contenu à l’intérieur du champ, après le texte saisi, pour insérer un suffixe visuel ou un bouton métier.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'details': {
			description: 'Slot de détail affiché sous le champ, souvent utilisé pour ajouter un texte d’accompagnement ou des informations complémentaires.',
			control: false,
			table: {
				type: { summary: 'slot' },
				category: 'slots',
			},
		},
		'modelValue': {
			control: 'object',
			description: 'Date sélectionnée en mode simple, plage de dates [start, end] en mode range, ou liste de dates en mode multiple. La valeur est renvoyée au format JavaScript Date, ou undefined si le champ est vide.',
			table: {
				type: { summary: 'Date | [Date, Date] | Date[] | undefined' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
		'mode': {
			control: 'select',
			options: ['single', 'range', 'multiple'],
			description: 'Mode de saisie. En mode range, le champ attend une plage de dates au format JJ/MM/AAAA - JJ/MM/AAAA. En mode multiple, le champ accepte une liste de dates séparées par le séparateur défini par la prop separator.',
			table: {
				type: { summary: '"single" | "range" | "multiple"' },
				defaultValue: { summary: '"single"' },
				category: 'props',
			},
		},
		'inputFormat': {
			control: 'select',
			options: ['DD/MM/YYYY', 'DD.MM.YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de saisie et d’affichage des dates dans le champ. Les jetons D, M et Y représentent respectivement le jour, le mois et l’année (ex: "DD/MM/YYYY", "YYYY-MM-DD").',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '"DD/MM/YYYY"' },
				category: 'props',
			},
		},
		'separator': {
			control: 'text',
			description: 'Séparateur entre les dates en mode range et multiple, utilisé pour l’affichage et la saisie (ex: " - ", ", ").',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '" - "' },
				category: 'props',
			},
		},
		'disabled': {
			control: 'boolean',
			description: 'Désactive le composant, le champ de saisie et le sélecteur visuel.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'readonly': {
			control: 'boolean',
			description: 'Passe le composant en lecture seule : la date peut être consultée mais pas modifiée.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque à côté du label pour indiquer un champ requis.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'clearable': {
			control: 'boolean',
			description: 'Affiche un bouton permettant de vider le champ et de réinitialiser la date sélectionnée.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'minYear': {
			description: 'Année minimale affichée dans le sélecteur visuel. Ne concerne pas la validation.',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '1900' },
				category: 'props',
			},
		},
		'maxYear': {
			description: 'Année maximale affichée dans le sélecteur visuel. Ne concerne pas la validation.',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '2100' },
				category: 'props',
			},
		},
		'yearsOrder': {
			description: 'Ordre d’affichage des années dans le sélecteur visuel. Peut être "asc" pour un ordre croissant ou "desc" pour un ordre décroissant.',
			control: 'select',
			options: ['asc', 'desc'],
			table: {
				type: { summary: '"asc" | "desc"' },
				defaultValue: { summary: '"asc"' },
				category: 'props',
			},
		},
		'initialView': {
			description: 'Vue initiale affichée lorsque la modale de sélection de date est ouverte.',
			control: 'select',
			options: ['days', 'months', 'years'],
			table: {
				type: { summary: '"days" | "months" | "years"' },
				defaultValue: { summary: '"days"' },
				category: 'props',
			},
		},
		'placeholder': {
			description: 'Texte affiché dans le champ de saisie lorsque aucune valeur n’est sélectionnée.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'label': {
			description: 'Label du champ de saisie du sélecteur de date.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'density': {
			description: 'Densité d’affichage du champ de saisie. Peut être "default", "comfortable" ou "compact".',
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			table: {
				type: { summary: '"default" | "comfortable" | "compact"' },
				defaultValue: { summary: '"default"' },
				category: 'props',
			},
		},
		'hint': {
			description: 'Texte d’aide affiché sous le champ de saisie lorsque le champ est focus. Le type supporte aussi false pour désactiver ce message.',
			control: 'text',
			table: {
				type: { summary: 'string | false' },
				category: 'props',
			},
		},
		'helpText': {
			description: 'Texte d’aide permanent affiché sous le champ de saisie.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '"Format JJ/MM/AAAA"' },
				category: 'props',
			},
		},
		'required': {
			description: 'Indique que la date est obligatoire. L’état requis est pris en compte par la validation du composant.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},

		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lorsqu’une date valide est saisie dans le champ ou sélectionnée dans la modale (objet Date, plage de dates en mode range, liste de dates en mode multiple), ou avec `undefined` lorsque le champ est vidé.',
			table: {
				type: { summary: 'Date | [Date, Date] | Date[] | undefined' },
			},
		},
		'onUpdate:open': {
			action: 'update:open',
			description: 'Événement émis lorsque le sélecteur de date est ouvert ou fermé.',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'onUpdate:view': {
			action: 'update:view',
			description: 'Événement émis lorsque la vue du sélecteur visuel change (jours, mois ou années) : bascule via l’en-tête, retour aux jours après sélection d’un mois ou d’une année, et réinitialisation à l’ouverture.',
			table: {
				type: { summary: '"days" | "months" | "years"' },
			},
		},
		'onChange': {
			action: 'change',
			description: 'Événement émis lorsque la valeur change par interaction utilisateur : date valide saisie au clavier, sélectionnée dans le sélecteur visuel ou champ vidé.',
			table: {
				type: { summary: 'Date | [Date, Date] | Date[] | undefined' },
			},
		},
		'onFocus': {
			action: 'focus',
			description: 'Événement émis lorsque le champ de saisie reçoit le focus.',
			table: {
				type: { summary: 'FocusEvent' },
			},
		},
		'onBlur': {
			action: 'blur',
			description: 'Événement émis lorsque le champ de saisie perd le focus.',
			table: {
				type: { summary: 'FocusEvent' },
			},
		},
		'onClear': {
			action: 'clear',
			description: 'Événement émis lorsque le champ est vidé (bouton d’effacement ou saisie supprimée).',
		},
		'onKeydown': {
			action: 'keydown',
			description: 'Événement émis à chaque frappe clavier sur le champ de saisie.',
			table: {
				type: { summary: 'KeyboardEvent' },
			},
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'modelValue': new Date(2025, 10, 11),
		'label': 'Début du projet',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'onUpdate:view': fn(),
		'onChange': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClear': fn(),
		'onKeydown': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
				message: 'Le format doit être JJ/MM/AAAA. (ex: 25/12/2026).',
			},
		}],
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const value = ref<Date | undefined>(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			/>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Début du projet"
						:custom-rules="rules"
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value: string | undefined) => /^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$/.test(value ?? ''),
							message: 'Le format doit être JJ/MM/AAAA (ex: 25/12/2026).',
						},
					}]
				</script>
				`,
			},
		],
	},
}

export const Range: Story = {
	args: {
		'mode': 'range',
		'modelValue': [new Date(2025, 8, 3), new Date(2025, 8, 10)],
		'label': 'Période',
		'helpText': 'Format JJ/MM/AAAA - JJ/MM/AAAA',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'onUpdate:view': fn(),
		'onChange': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClear': fn(),
		'onKeydown': fn(),
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const value = ref<[Date, Date] | undefined>(args.modelValue as [Date, Date] | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as [Date, Date] | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			/>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedRange"
						mode="range"
						label="Période"
						help-text="Format JJ/MM/AAAA - JJ/MM/AAAA"
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedRange = ref<[Date, Date] | undefined>([
						new Date(2025, 8, 3),
						new Date(2025, 8, 10),
					])
				</script>
				`,
			},
		],
	},
}

export const CustomDisplayedYears: Story = {
	args: {
		'modelValue': new Date(2025, 10, 11),
		'label': 'Début du projet',
		'minYear': 2000,
		'maxYear': 2025,
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'onUpdate:view': fn(),
		'onChange': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClear': fn(),
		'onKeydown': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Début du projet"
						:min-year="2000"
						:max-year="2025"
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))
				</script>
				`,
			},
		],
	},
}

export const Required: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 10, 11),
		required: true,
		displayAsterisk: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Affiche un champ obligatoire avec son indicateur visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Date de début"
						required
						display-asterisk
					/>
				</template>`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))
				</script>`,
			},
		],
	},
}

export const Clearable: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 10, 11),
		clearable: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Affiche une action pour vider la date sélectionnée.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Date de début"
						clearable
					/>
				</template>`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))
				</script>`,
			},
		],
	},
}

export const Disabled: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 10, 11),
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Désactive la saisie et l’ouverture du sélecteur visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Date de début"
						disabled
					/>
				</template>`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))
				</script>`,
			},
		],
	},
}

export const Readonly: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 10, 11),
		readonly: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Date de début"
						readonly
					/>
				</template>`,
			},
		],
	},
}

export const CustomInputFormat: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 10, 11),
		inputFormat: 'YYYY-MM-DD',
		helpText: 'Format AAAA-MM-JJ',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Date de début"
						input-format="YYYY-MM-DD"
						help-text="Format AAAA-MM-JJ"
					/>
				</template>`,
			},
		],
	},
}

export const CustomRangeSeparator: Story = {
	args: {
		label: 'Période',
		mode: 'range',
		modelValue: [new Date(2025, 10, 11), new Date(2025, 10, 21)],
		separator: ' au ',
		helpText: 'Format JJ/MM/AAAA au JJ/MM/AAAA',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedRange"
						mode="range"
						label="Période"
						separator=" au "
						help-text="Format JJ/MM/AAAA au JJ/MM/AAAA"
					/>
				</template>`,
			},
		],
	},
}

export const Multiple: Story = {
	args: {
		'label': 'Dates de rendez-vous',
		'mode': 'multiple',
		'modelValue': [new Date(2025, 10, 11), new Date(2025, 10, 21)],
		'separator': ', ',
		'helpText': 'Format JJ/MM/AAAA, JJ/MM/AAAA',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'onUpdate:view': fn(),
		'onChange': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
		'onClear': fn(),
		'onKeydown': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}(, (0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4})*$/.test(value ?? ''),
				message: 'Chaque date doit être au format JJ/MM/AAAA. (ex: 25/12/2026, 31/12/2026).',
			},
		}],
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const value = ref<Date[] | undefined>(args.modelValue as Date[] | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date[] | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			/>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDates"
						mode="multiple"
						label="Dates de rendez-vous"
						separator=", "
						:custom-rules="rules"
					/>
				</template>`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDates = ref<Date[]>([
						new Date(2025, 10, 11),
						new Date(2025, 10, 21),
					])

					const rules = [{
						type: 'custom',
						options: {
							validate: (value: string | undefined) => /^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}(, (0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4})*$/.test(value ?? ''),
							message: 'Chaque date doit être au format JJ/MM/AAAA. (ex: 25/12/2026, 31/12/2026).',
						},
					}]
				</script>`,
			},
		],
	},
}
