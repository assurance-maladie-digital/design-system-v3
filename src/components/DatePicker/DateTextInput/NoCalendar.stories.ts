import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '../DatePicker/DatePicker.vue'
import { ref } from 'vue'

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
	},
	argTypes: {
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
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
		},
		disabled: {
			control: 'boolean',
			description: 'Désactive le champ',
		},
		readonly: {
			control: 'boolean',
			description: 'Le champ est en lecture seule',
		},
		isOutlined: {
			control: 'boolean',
			description: 'Affiche le champ en contour',
		},
		displayIcon: {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier',
		},
		displayAppendIcon: {
			control: 'boolean',
			description: 'Icône à la fin du champ',
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement',
		},
		displayPrependIcon: {
			control: 'boolean',
			description: 'Icône au début du champ',
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
			control: 'color',
			description: 'Couleur de fond',
		},
		displayRange: {
			control: 'boolean',
			description: 'Sélection de plage de dates',
		},
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		placeholder: 'JJ/MM/AAAA',
		label: 'Date',
		displayIcon: true,
		displayPrependIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		disableErrorHandling: false,
		required: false,
		isOutlined: true,
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

export const EuropeanFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						date-format-return="YYYY/MM/DD"
						placeholder="JJ/MM/AAAA"
						required
						no-icon
						no-calendar
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'YYYY/MM/DD',
		placeholder: 'JJ/MM/AAAA',
		required: true,
		noIcon: true,
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
					<h4 class="mb-4">Format européen avec règles de base (format de date valide) :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur (dateFormatReturn: 'YYYY/MM/DD') : {{ date }}
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
						date-format-return="DD/MM/YYYY"
						format="DD/MM/YYYY"
						placeholder="DD/MM/YYYY"
						required
						no-calendar
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: value => !value || !value.includes('2024'),
								message: 'Les dates en 2024 ne sont pas autorisées',
								successMessage: 'Les dates hors 2024 sont autorisées',
								fieldIdentifier: 'date'
							}
						}]"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'DD/MM/YYYY',
		placeholder: 'DD/MM/YYYY',
		required: true,
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2024'),
				message: 'Les dates en 2024 ne sont pas autorisées',
				successMessage: 'Les dates hors 2024 sont autorisées',
				fieldIdentifier: 'date',
			},
		}],
	},
	render(args) {
		const date = ref<string | null>('21/12/2024')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Format avec règles personnalisées :</h4>
					<p class="mb-4">Les dates en 2024 ne sont pas autorisées</p>
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

export const WarningRules: Story = {
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
						no-calendar
						:custom-warning-rules="[{
							type: 'custom',
							options: {
								validate: value => !value || !value.includes('2025'),
								warningMessage: 'Les dates en 2025 ne sont pas autorisées',
								successMessage: 'Date hors 2025',
								fieldIdentifier: 'date',
								isWarning: true
							}
						}]"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		placeholder: 'JJ/MM/AAAA',
		customWarningRules: [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2025'),
				warningMessage: 'Les dates en 2025 ne sont pas autorisées',
				successMessage: 'Date hors 2025',
				fieldIdentifier: 'date',
				isWarning: true,
			},
		}],
	},
	render(args) {
		const date = ref<string | null>('20/12/2025')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Format avec règles d'avertissement :</h4>
					<p class="mb-4">Les dates en 2025 ne sont pas autorisées</p>
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

// export const WithErrorDisabled: Story = {
// 	parameters: {
// 		sourceCode: [
// 			{
// 				name: 'Template',
// 				code: `
// 				<template>
// 					<DatePicker
// 						v-model="date"
// 						placeholder="Sélectionner une date"
// 						format="DD/MM/YYYY"
// 						:required="true"
// 						:disableErrorHandling="true"
// 					/>
// 				</template>
// 				`,
// 			},
// 			{
// 				name: 'Script',
// 				code: `
// 				<script setup lang="ts">
// 					import { ref } from 'vue'
// 					import { DatePicker } from '@cnamts/synapse'

// 					const date = ref('')
// 				</script>
// 				`,
// 			},
// 		],
// 	},
// 	args: {
// 		placeholder: 'Date requise sans affichage d\'erreur',
// 		format: 'DD/MM/YYYY',
// 		isBirthDate: false,
// 		showWeekNumber: false,
// 		required: true,
// 		displayRange: false,
// 		displayIcon: true,
// 		displayAppendIcon: false,
// 		disabled: false,
// 		noIcon: false,
// 		noCalendar: true,
// 		disableErrorHandling: true,
// 		modelValue: '',
// 	},
// 	render: (args) => {
// 		return {
// 			components: { DatePicker: DatePicker },
// 			setup() {
// 				const value = ref('')
// 				return { args, value }
// 			},
// 			template: `
//               <div class="d-flex flex-column pa-4">
//                 <div class="mb-5">
//                   <p class="mb-3">Ce champ est requis mais n'affiche pas de message d'erreur grâce à <code>disableErrorHandling</code>:</p>
//                   <DatePicker v-bind="args" v-model="value"/>
//                 </div>
//                 <div>
//                   <p class="mb-3">Comparaison avec un champ requis standard:</p>
//                   <DatePicker
//                     placeholder="Date requise avec erreur"
//                     format="DD/MM/YYYY"
//                     :required="true"
//                     v-model="value"
//                   />
//                 </div>
//               </div>
//             `,
// 		}
// 	},
// }

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
						placeholder="JJ/MM/AAAA"
						no-calendar
						display-append-icon
					/>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		placeholder: 'JJ/MM/AAAA',
		displayAppendIcon: true,
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

export const WithErrorDisabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex">
						<div class="mr-4" style="width: 300px;">
							<p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date1"
								format="DD/MM/YYYY"
								placeholder="Date requise sans erreur"
								required
								no-icon
								no-calendar
								:disableErrorHandling="true"
							/>
						</div>
						<div style="width: 300px;">
							<p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date2"
								format="DD/MM/YYYY"
								placeholder="Date requise avec erreur"
								required
								no-icon
								no-calendar
							/>
						</div>
					</div>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'YYYY/MM/DD',
		placeholder: 'Date requise sans erreur',
		required: true,
		noIcon: true,
		disableErrorHandling: true,
	},
	render(args) {
		const date1 = ref<string | null>(null)
		const date2 = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date1, date2 }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">DateTextInput avec désactivation des erreurs</h4>
					<div class="d-flex mb-4">
						<div class="mr-4" style="width: 300px;">
							<p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date1"
								v-bind="args"
							/>
							<div style="margin-top: 10px; font-family: monospace; color: #666;">
								Valeur : {{ date1 }}
							</div>
						</div>
						
						<div style="width: 300px;">
							<p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date2"
								format="DD/MM/YYYY"
								placeholder="Date requise avec erreur"
								required
								no-icon
								no-calendar
							/>
							<div style="margin-top: 10px; font-family: monospace; color: #666;">
								Valeur : {{ date2 }}
							</div>
						</div>
					</div>
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
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value2"
							placeholder="Format MM/DD/YYYY"
							format="MM/DD/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value3"
							placeholder="Format YYYY-MM-DD"
							format="YYYY-MM-DD"
							no-calendar
						/>
						<DatePicker
							v-model="value4"
							placeholder="Format DD-MM-YY"
							format="DD-MM-YY"
							no-calendar
						/>
						<DatePicker
							v-model="value5"
							placeholder="Format DD.MM.YYYY"
							format="DD.MM.YYYY"
							no-calendar
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
                    placeholder="Format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    no-calendar
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="Format MM/DD/YYYY"
                    format="MM/DD/YYYY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value3"
                    placeholder="Format YYYY-MM-DD"
                    format="YYYY-MM-DD"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value4"
                    placeholder="Format DD-MM-YY"
                    format="DD-MM-YY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value5"
                    placeholder="Format DD.MM.YYYY"
                    format="DD.MM.YYYY"
					no-calendar
					class="py-4"
                />
              </div>
            `,
		}
	},
}
