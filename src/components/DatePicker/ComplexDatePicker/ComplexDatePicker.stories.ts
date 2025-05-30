import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '../DatePicker/DatePicker.vue'
import { ref, onMounted } from 'vue'

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
	},
	argTypes: {
		modelValue: {
			control: 'text',
			description: 'Valeur du champ',
		},
		placeholder: {
			control: 'text',
			description: 'Texte indicatif',
		},
		format: {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date',
		},
		dateFormatReturn: {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date pour la valeur de retour',
		},
		isBirthDate: {
			control: 'boolean',
			description: 'Mode date de naissance',
		},
		showWeekNumber: {
			control: 'boolean',
			description: 'Affiche les numéros de semaine',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
		},
		displayRange: {
			control: 'boolean',
			description: 'Sélection de plage de dates',
		},
		displayIcon: {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier',
		},
		displayAppendIcon: {
			control: 'boolean',
			description: 'Icône à la fin du champ',
		},
		displayPrependIcon: {
			control: 'boolean',
			description: 'Icône au début du champ',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation personnalisées ({ type: string, options: any }[])',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées ({ type: string, options: any }[])',
		},
		disabled: {
			control: 'boolean',
			description: 'Désactive le champ',
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
		},
		noCalendar: {
			table: {
				category: 'props',
			},
			control: 'boolean',
			description: 'Désactive l\'affichage du calendrier (saisie manuelle uniquement)',
		},
		isOutlined: {
			control: 'boolean',
			description: 'Utilise le style "outlined" pour le champ',
		},
		readonly: {
			control: 'boolean',
			description: 'Champ en lecture seule',
		},
		width: {
			control: 'text',
			description: 'Largeur du champ (par exemple, "300px" ou "100%")',
		},
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs par le composant',
		},
		showSuccessMessages: {
			control: 'boolean',
			description: 'Affiche les messages de succès',
		},
		bgColor: {
			control: 'text',
			description: 'Couleur de fond du champ (par exemple, "white" ou "transparent")',
		},
		textFieldActivator: {
			control: 'boolean',
			description: 'Utilise le TextField comme activateur du DatePicker',
		},
		displayTodayButton: {
			control: 'boolean',
			description: 'Affiche le bouton "Aujourd\'hui"',
		},
		displayWeekendDays: {
			control: 'boolean',
			description: 'Affiche les jours de week-end',
		},
		period: {
			control: 'object',
			description: 'Période pendant laquelle les dates peuvent être sélectionnées (au format: MM/DD/YYYY)',
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
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		isBirthDate: false,
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
		displayTodayButton: true,
		displayWeekendDays: true,
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
		placeholder: 'Sélectionner une période',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: true,
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
							placeholder="Format d'affichage: DD/MM/YYYY, Format de retour: YYYY-MM-DD"
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
                  placeholder="Format d'affichage: DD/MM/YYYY, Format de retour: YYYY-MM-DD"
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
						placeholder="Format YYYY.MM.DD"
						format="YYYY.MM.DD"
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
		placeholder: 'Format YYYY.MM.DD',
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

export const WithCustomIcons: Story = {
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
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
			<div style="margin-bottom: 20px; padding: 15px; border: 2px solid #FF5252; border-radius: 8px; background-color: #FFEBEE;"> 
				<h3 style="color: #D32F2F; margin-top: 0;">Note importante pour la validation manuelle</h3>
				<p>
					Pour valider les dates saisies manuellement en fonction de la période définie, <strong>il faut utiliser la propriété customRules</strong> comme dans l'exemple ci-dessous.
				</p>
				<p style="margin-bottom: 0;">
					La propriété <code style="background-color: #F5F5F5; padding: 2px 4px; border-radius: 4px;">period</code> limite les dates sélectionnables dans le calendrier, mais les règles personnalisées sont nécessaires pour la validation des saisies manuelles.
				</p>
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
