import { fn } from '@storybook/test'
import { nextTick, ref } from 'vue'
import MonthPicker from './MonthPicker.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import type SyTextField from '../Customs/SyTextField/SyTextField.vue'
import SyForm from '../Customs/SyForm/SyForm.vue'

const meta: Meta<typeof MonthPicker> = {
	title: 'Composants/Formulaires/MonthPicker',
	component: MonthPicker,
	argTypes: {
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
				type: { summary: 'object' },
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
		'helpText': {
			description: 'Texte d’aide affiché sous le champ de saisie.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'customRules': {
			description: 'Règles de validation personnalisées pour les erreurs.',
			table: {
				type: { summary: 'ValidationRule[]' },
				category: 'props',
			},
		},
		'customWarningRules': {
			description: 'Règles de validation personnalisées pour les avertissements.',
			table: {
				type: { summary: 'ValidationRule[]' },
				category: 'props',
			},
		},
		'customSuccessRules': {
			description: 'Règles de validation personnalisées pour les succès.',
			table: {
				type: { summary: 'ValidationRule[]' },
				category: 'props',
			},
			category: 'validation',
		},
		'errorMessages': {
			description: 'Messages d’erreur personnalisés à afficher lorsque la validation échoue. Peut être une chaîne de caractères ou un tableau de chaînes.',
			control: 'text',
			table: {
				type: { summary: 'string | string[]' },
				category: 'props',
			},
		},
		'warningMessages': {
			description: 'Messages d’avertissement personnalisés à afficher lorsque la validation génère un avertissement. Peut être une chaîne de caractères ou un tableau de chaînes.',
			control: 'text',
			table: {
				type: { summary: 'string | string[]' },
				category: 'props',
			},
		},
		'successMessages': {
			description: 'Messages de succès personnalisés à afficher lorsque la validation réussit. Peut être une chaîne de caractères ou un tableau de chaînes.',
			control: 'text',
			table: {
				type: { summary: 'string | string[]' },
				category: 'props',
			},
		},
		'hasError': {
			description: 'Indique si le champ est en état d’erreur. Utilisé pour forcer l’affichage des messages d’erreur.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		'hasWarning': {
			description: 'Indique si le champ est en état d’avertissement. Utilisé pour forcer l’affichage des messages d’avertissement.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		'hasSuccess': {
			description: 'Indique si le champ est en état de succès. Utilisé pour forcer l’affichage des messages de succès.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		'showSuccessMessages': {
			description: 'Indique si les messages de succès doivent être affichés.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		'disabled': {
			description: 'Indique si le champ de saisie est désactivé. Lorsqu’il est désactivé, le sélecteur de mois ne peut pas être ouvert et aucune interaction n’est possible.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'readonly': {
			description: 'Indique si le champ de saisie est en lecture seule. Lorsqu’il est en lecture seule, le sélecteur de mois peut être ouvert pour afficher la valeur sélectionnée, mais aucune modification n’est possible.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
			category: 'props',
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

export const MonthValidation: Story = {
	args: {
		'modelValue': '11/2025',
		'label': 'Début du projet',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
	},
	play: async ({ canvasElement }) => {
		const input = canvasElement.querySelector('input') as HTMLInputElement
		const currentDate = new Date()
		setTimeout(async () => {
			input.focus()
			input.value = '19/2025'
			input.dispatchEvent(new Event('input'))
			await nextTick()
			input.dispatchEvent(new Event('blur'))
		}, 1500)

		setTimeout(async () => {
			input.focus()
			const futureYear = currentDate.getFullYear() + 6
			input.value = `11/${futureYear}`
			input.dispatchEvent(new Event('input'))
			await nextTick()
			input.dispatchEvent(new Event('blur'))
		}, 3000)

		setTimeout(async () => {
			input.focus()
			const validYear = currentDate.getFullYear() + 1
			input.value = `11/${validYear}`
			input.dispatchEvent(new Event('input'))
			await nextTick()
			input.dispatchEvent(new Event('blur'))
		}, 4500)
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
						:custom-rules
						:custom-warning-rules
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

					const customRules = [
						{
							type: 'required',
							options: {
								message: 'Ce champ est requis.',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const [month] = value.split('/').map(Number)
									if (
										!value ||
										!month ||
										!/^\\d{2}\\/\\d{4}$/.test(value) ||
										month < 1 ||
										month > 12
									) {
										return false
									}
									return true
								},
								message: 'Format de mois invalide.',
							},
						},
					]

					const customWarningRules = [{
						type: 'custom',
						options: {
							validate: (value: string) => {
								const [month, year] = value.split('/').map(Number) as [number, number]
								const currentDate = new Date()
								const currentYear = currentDate.getFullYear()
								const currentMonth = currentDate.getMonth() + 1
								if (year > currentYear + 5 || (year === currentYear + 5 && month > currentMonth)) {
									return false
								}
								return true
							},
							warningMessage: 'La date est plus de 5 ans dans le futur.',
						},
					}]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker },
		setup() {
			const customRules = [
				{
					type: 'required',
					options: {
						message: 'Ce champ est requis.',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							const [month] = value.split('/').map(Number)
							if (
								!month
								|| !/^\d{2}\/\d{4}$/.test(value)
								|| month < 1
								|| month > 12
							) {
								return false
							}
							return true
						},
						message: 'Format de mois invalide.',
					},
				},
			]

			const customWarningRules = [{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const [month, year] = value.split('/').map(Number) as [number, number]
						const currentDate = new Date()
						const currentYear = currentDate.getFullYear()
						const currentMonth = currentDate.getMonth() + 1
						if (year > currentYear + 5 || (year === currentYear + 5 && month > currentMonth)) {
							return false
						}
						return true
					},
					warningMessage: 'La date est plus de 5 ans dans le futur.',
				},
			}]
			return { args, customRules, customWarningRules }
		},
		template: `
			<MonthPicker
				v-bind="args"
				:custom-rules="customRules"
				:custom-warning-rules="customWarningRules"
				width="400px"
			/>
		`,
	}),
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

export const Form: Story = {
	args: {
		modelValue: '',
		label: 'Début du projet',
		width: '400px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyForm @submit="handleSubmit">
						<MonthPicker
							v-model="selectedMonth"
							label="Début du projet"
							width="400px"
							:custom-rules="[{ type: 'required', options: { message: 'Ce champ est requis.' } }]"
						/>
						<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
					</SyForm>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MonthPicker, SyForm } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedMonth = ref('11/2025')

					const handleSubmit = (e: { isValid: boolean }) => {
						alert(e.isValid ? 'Le formulaire est valide.' : 'Le formulaire est invalide.')
					}
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker, SyForm },
		setup() {
			const selectedMonth = ref('11/2025')

			const handleSubmit = (e: { isValid: boolean }) => {
				alert(e.isValid ? 'Le formulaire est valide.' : 'Le formulaire est invalide.')
			}

			return { args, selectedMonth, handleSubmit }
		},
		template: `
			<SyForm @submit="handleSubmit">
				<MonthPicker
					v-bind="args"
					v-model="selectedMonth"
					width="400px"
					:custom-rules="[{ type: 'required', options: { message: 'Ce champ est requis.' } }]"
				/>
				<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
			</SyForm>
		`,
	}),
}
