import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from './DatePicker.vue'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Formulaires/DatePicker',
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
		isOutlined: {
			control: 'boolean',
			description: 'Affiche le champ en contour',
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
			description: 'Désactive l\'affichage du calendrier (saisie manuelle uniquement), elle permet les copier coller et le passage de robots',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement',
		},
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs par le composant',
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
		placeholder: 'Sélectionner une période',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: true,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: ['', ''],
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
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: true,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '',
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
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: false,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '',
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
		placeholder: 'Date de naissance',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: true,
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
							{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd'hui' } }
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
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '01/01/2100',
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
		],
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
		placeholder: 'Date avec avertissement',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '20/12/2023',
		customWarningRules: [
			{
				type: 'notBeforeDate', options: {
					warningMessage: 'Attention : la date est antérieure à la date de référence',
					date: '01/01/2024',
					isWarning: true,
				},
			},
		],
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
		placeholder: 'Date valide',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: true,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '22/01/2024',
		customRules: [
			{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } },
		],
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
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
						/>
						<DatePicker
							v-model="value2"
							placeholder="Format MM/DD/YYYY"
							format="MM/DD/YYYY"
						/>
						<DatePicker
							v-model="value3"
							placeholder="Format YYYY-MM-DD"
							format="YYYY-MM-DD"
						/>
						<DatePicker
							v-model="value4"
							placeholder="Format DD-MM-YY"
							format="DD-MM-YY"
						/>
						<DatePicker
							v-model="value5"
							placeholder="Format DD.MM.YYYY"
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
                    placeholder="Format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="Format MM/DD/YYYY"
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
                    placeholder="Format DD/MM/YYYY, retour par défaut"
                    format="DD/MM/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value2 }}</span>
                <DatePicker
                    v-model="value2"
                    placeholder="Format DD/MM/YYYY, retour MM/DD/YYYY"
                    format="DD/MM/YYYY"
                    date-format-return="MM/DD/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
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
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '24/12/2025',
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
                    placeholder="Format DD/MM/YYYY, retour par défaut"
                    format="DD/MM/YYYY"
                />

                <span class="mb-4">Date de retour : {{ value2 }}</span>
                <DatePicker
                    v-model="value2"
                    placeholder="Format DD/MM/YYYY, retour MM/DD/YYYY"
                    format="DD/MM/YYYY"
					date-format-return="MM/DD/YYYY"
                />


                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
					date-format-return="YYYY-MM-DD"
                />
              </div>
            `,
		}
	},
}

export const NoCalendarEuropeanFormat: Story = {
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

export const NoCalendarCustomRules: Story = {
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

export const NoCalendarWarningRules: Story = {
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

export const WithErrorDisabled: Story = {
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
						:required="true"
						:disableErrorHandling="true"
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
		placeholder: 'Date requise sans affichage d\'erreur',
		format: 'DD/MM/YYYY',
		isBirthDate: false,
		showWeekNumber: false,
		required: true,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		disabled: false,
		noIcon: false,
		noCalendar: false,
		disableErrorHandling: true,
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <div class="mb-5">
                  <p class="mb-3">Ce champ est requis mais n'affiche pas de message d'erreur grâce à <code>disableErrorHandling</code>:</p>
                  <DatePicker v-bind="args" v-model="value"/>
                </div>
                <div>
                  <p class="mb-3">Comparaison avec un champ requis standard:</p>
                  <DatePicker
                    placeholder="Date requise avec erreur"
                    format="DD/MM/YYYY"
                    :required="true"
                    v-model="value"
                  />
                </div>
              </div>
            `,
		}
	},
}

export const NoCalendarWithAppendIcon: Story = {
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
					<h4 class="mb-4">Format avec icône en préfixe</h4>
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

export const NoCalendarWithErrorDisabled: Story = {
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
