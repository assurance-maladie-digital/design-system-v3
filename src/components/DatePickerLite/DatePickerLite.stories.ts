import { fn } from 'storybook/test'
import { ref, watch } from 'vue'
import DatePickerLite from './DatePickerLite.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import type { DatePickerLiteProps } from './types'

type DatePickerLiteStoryProps = DatePickerLiteProps & {
	'onUpdate:modelValue'?: (value: Date | undefined) => void
	'onUpdate:open'?: (value: boolean) => void
}

const meta: Meta<DatePickerLiteStoryProps> = {
	title: 'Composants/Formulaires/DatePickerLite',
	component: DatePickerLite,
	parameters: {
		docs: {
			description: {
				component: 'Sélecteur de date avec saisie libre et ouverture d’un sélecteur visuel. Le composant prend en charge la sélection au clavier, l’ouverture/fermeture, la validation et le comportement accessible sur les boutons de navigation du mois et de l’année.',
			},
			controls: {
				exclude: ['onUpdate:modelValue', 'onUpdate:open'],
			},
		},
		controls: {
			exclude: ['width', 'undefined', 'onUpdate:modelValue', 'onUpdate:open'],
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
		'modelValue': {
			control: 'object',
			description: 'Date sélectionnée en mode simple, ou plage de dates [start, end] en mode range. La valeur est renvoyée au format JavaScript Date, ou undefined si le champ est vide.',
			table: {
				type: { summary: 'Date | [Date, Date] | undefined' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
		'mode': {
			control: 'select',
			options: ['single', 'range'],
			description: 'Active le mode de saisie. En mode range, le champ attend une plage de dates au format JJ/MM/AAAA - JJ/MM/AAAA.',
			table: {
				type: { summary: '"single" | "range"' },
				defaultValue: { summary: '"single"' },
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
			description: 'Événement émis lorsqu’une date valide est saisie dans le champ ou sélectionnée dans la modale (objet Date), ou avec `undefined` lorsque le champ est vidé.',
			table: {
				type: { summary: 'Date | undefined' },
			},
		},
		'onUpdate:open': {
			action: 'update:open',
			description: 'Événement émis lorsque le sélecteur de date est ouvert ou fermé.',
			table: {
				type: { summary: 'boolean' },
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
