import { fn } from 'storybook/test'
import MonthPicker from './MonthPicker.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type SyTextField from '../Customs/SyTextField/SyTextField.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta<typeof MonthPicker> = {
	title: 'Composants/Formulaires/MonthPicker',
	component: MonthPicker,
	argTypes: {
		...getValidationDocumentation('base'),
		'modelValue': {
			control: 'text',
			description: 'Valeur du sélecteur de mois au format "MM/YYYY".',
			table: {
				type: { summary: 'string' },
			},
		},
		'locales': {
			description: 'Objet de traduction pour le sélecteur de mois. Par défaut, les traductions françaises sont utilisées.',
			table: {
				type: {
					summary: 'object',
					detail: `{
	btnLabel: string,
	headerSelectYear: string,
	headerSelectMonth: string,
	yearSelectorLabel: string,
	monthSelectorLabel: string,
	yearBtnLabelSelected: (selectedYear: string) => string,
	yearBtnLabelUnselected: (selectedYear: string) => string,
	monthBtnLabelSelected: (selectedMonth: string) => string,
	monthBtnLabelUnselected: (selectedMonth: string) => string,
	fieldRequired: (label: string) => string,
}`,
				},
			},
		},
		'clearable': {
			control: 'boolean',
			description: 'Affiche un bouton permettant de vider le champ',
			table: {
				type: { summary: 'boolean' },
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
			description: 'Vue initiale affichée lorsque la modale de sélection de mois est ouverte.',
			control: 'select',
			options: ['months', 'years'],
			table: {
				type: { summary: '"months" | "years"' },
				defaultValue: { summary: '"months"' },
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
			description: 'Label du champ de saisie du sélecteur de mois.',
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
			description: 'Texte d’aide affiché sous le champ de saisie lorsque le champ est focus.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'helpText': {
			description: 'Texte d’aide permanent affiché sous le champ de saisie.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lorsque le champs de saisie change (quelque soit la valeur renseigné même incomplète ou invalide) ou lorsque un mois ET une année sont sélectionnés dans la modale. La valeur est toujours au format "MM/YYYY".',
			table: {
				type: { summary: 'string' },
			},
		},
		'onUpdate:open': {
			action: 'update:open',
			description: 'Événement émis lorsque le sélecteur de mois est ouvert ou fermé. Si seulement une année ou un mois est sélectionné, le contenu de ma modale est réinitialisé et aucun événement "update:modelValue" n’est émis.',
			table: {
				type: { summary: 'boolean' },
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['width', 'undefined', 'onUpdate:modelValue', 'onUpdate:open'],
		},
		docs: {
			controls: {
				exclude: ['onUpdate:modelValue', 'onUpdate:open'],
			},
		},
	},
}

export default meta
type Story = StoryObj<typeof MonthPicker & typeof SyTextField>

export const Default: Story = {
	args: {
		'modelValue': '11/2025',
		'label': 'Début du projet',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'width': '400px',
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value),
				message: 'Le format doit être MM/YYYY. (ex: 12/2026).',
			},
		}],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Début du projet"
						width="400px"
						:custom-rules="rules"
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MonthPicker } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedMonth = ref('11/2025')

					const rules = [{
						type: 'custom',
						options: {
							validate: (value: string) => /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value),
							message: 'Le format doit être MM/YYYY (ex: 12/2026).',
						},
					}]
				</script>
				`,
			},
		],
	},
}

export const Required: Story = {
	args: {
		'modelValue': '',
		'label': 'Début du projet',
		'required': true,
		'displayAsterisk': true,
		'width': '400px',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Début du projet"
						width="400px"
						required
						display-asterisk
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MonthPicker } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedMonth = ref('')
				</script>
				`,
			},
		],
	},
}

export const CustomDisplayedYears: Story = {
	args: {
		'modelValue': '11/2025',
		'label': 'Début du projet',
		'minYear': 2000,
		'maxYear': 2025,
		'width': '400px',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
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
					import { MonthPicker } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedMonth = ref('11/2025')
				</script>
				`,
			},
		],
	},
}
