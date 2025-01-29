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
		isDisabled: {
			control: 'boolean',
			description: 'Désactive le champ',
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
		},
		noCalendar: {
			control: 'boolean',
			description: 'Désactive le calendrier',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement',
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
		isDisabled: false,
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
		isDisabled: false,
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
		isDisabled: false,
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
		isDisabled: false,
		noIcon: false,
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
		isDisabled: false,
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
		isDisabled: false,
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
		isDisabled: false,
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
			components: { DatePicker },
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
		isDisabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '22/01/2024',
		customRules: [
			{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } },
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
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
							v-model="date1"
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
						/>
						<DatePicker
							v-model="date2"
							placeholder="Format MM/DD/YYYY"
							format="MM/DD/YYYY"
						/>
						<DatePicker
							v-model="date3"
							placeholder="Format YYYY-MM-DD"
							format="YYYY-MM-DD"
						/>
						<DatePicker
							v-model="date4"
							placeholder="Format DD-MM-YY"
							format="DD-MM-YY"
						/>
						<DatePicker
							v-model="date5"
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
				const value5 = ref('25.12.2025')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
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
                    dateFormatReturn="MM/DD/YYYY"
                />


                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    dateFormatReturn="YYYY-MM-DD"
                />
              </div>
            `,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'
					
					const date1 = ref('24/12/2025')
					const date2 = ref('24/12/2025')
					const date3 = ref('24/12/2025')
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
		isDisabled: false,
		noIcon: false,
		noCalendar: false,
		modelValue: '24/12/2025',
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const value1 = ref('24/12/2025')
				const value2 = ref('24/12/2025')
				const value3 = ref('24/12/2025')
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
                    dateFormatReturn="MM/DD/YYYY"
                />


                <span class="mb-4">Date de retour : {{ value3 }}</span>
                <DatePicker
                    v-model="value3"
                    placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    dateFormatReturn="YYYY-MM-DD"
                />
              </div>
            `,
		}
	},
}

export const DifferentFormatsWithRange: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column gap-4">
						<DatePicker
							v-model="dateRange1"
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
							displayRange
						/>
						<DatePicker
							v-model="dateRange2"
							placeholder="Format MM/DD/YYYY"
							format="MM/DD/YYYY"
							displayRange
						/>
						<DatePicker
							v-model="dateRange3"
							placeholder="Format YYYY-MM-DD"
							format="YYYY-MM-DD"
							displayRange
						/>
						<div class="mt-4">
							<p>Valeurs retournées :</p>
							<pre>Format DD/MM/YYYY : {{ dateRange1 }}</pre>
							<pre>Format MM/DD/YYYY : {{ dateRange2 }}</pre>
							<pre>Format YYYY-MM-DD : {{ dateRange3 }}</pre>
						</div>
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
					
					const dateRange1 = ref(['24/12/2025', '31/12/2025'])
					const dateRange2 = ref(['12/24/2025', '12/31/2025'])
					const dateRange3 = ref(['2025-12-24', '2025-12-31'])
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const dateRange1 = ref(['24/12/2025', '31/12/2025'])
				const dateRange2 = ref(['12/24/2025', '12/31/2025'])
				const dateRange3 = ref(['2025-12-24', '2025-12-31'])
				return { dateRange1, dateRange2, dateRange3 }
			},
			template: `
              <div class="d-flex flex-column gap-4 pa-4">
                <DatePicker
                    v-model="dateRange1"
                    placeholder="Format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    displayRange
                />
                <DatePicker
                    v-model="dateRange2"
                    placeholder="Format MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    displayRange
                />
                <DatePicker
                    v-model="dateRange3"
                    placeholder="Format YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    displayRange
                />
                <div class="mt-4">
                    <p>Valeurs retournées :</p>
                    <pre>Format DD/MM/YYYY : {{ dateRange1 }}</pre>
                    <pre>Format MM/DD/YYYY : {{ dateRange2 }}</pre>
                    <pre>Format YYYY-MM-DD : {{ dateRange3 }}</pre>
                </div>
              </div>
            `,
		}
	},
}

export const NoCalendar: Story = {
	args: {
		label: 'Date',
		noIcon: false,
		noCalendar: true,
		modelValue: '',
		rules: [
			{
				type: 'dateFormat',
				options: {
					message: 'Le format de la date est invalide (format attendu : JJ/MM/AAAA)',
				},
			},
		],
	},
	render: args => ({
		components: {
			DatePicker,
		},
		setup() {
			const date = ref(args.modelValue)
			return { args, date }
		},
		template: `
			<DatePicker
				v-bind="args"
				v-model="date"
			/>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Le composant peut être utilisé sans le calendrier, permettant uniquement la saisie manuelle de la date.',
			},
		},
	},
}

export const NoCalendarRange: Story = {
	args: {
		label: 'Période',
		noIcon: false,
		noCalendar: true,
		range: true,
		modelValue: ['', ''],
		rules: [
			{
				type: 'dateRange',
				options: {
					message: 'Le format de la plage est invalide (format attendu : JJ/MM/AAAA - JJ/MM/AAAA)',
				},
			},
		],
	},
	render: args => ({
		components: {
			DatePicker,
		},
		setup() {
			const date = ref(args.modelValue)
			return { args, date }
		},
		template: `
			<DatePicker
				v-bind="args"
				v-model="date"
			/>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Le composant peut être utilisé sans le calendrier en mode plage de dates.',
			},
		},
	},
}

export const NoCalendarWithError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="notAfterToday"
						format="DD/MM/YYYY"
						noCalendar
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
		placeholder: 'notAfterToday',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		noCalendar: true,
		modelValue: '01/01/2100',
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
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

export const NoCalendarWithWarning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						placeholder="Date avec avertissement"
						format="DD/MM/YYYY"
						noCalendar
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
		isDisabled: false,
		noIcon: false,
		noCalendar: true,
		modelValue: '20/12/2023',
		customWarningRules: [
			{
				type: 'notBeforeDate', options: {
					warningMessage: 'Attention : la date est antérieure à la date de référence',
					date: '01/01/2031',
					isWarning: true,
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { DatePicker },
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

export const NoCalendarWithDifferentFormats: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column gap-4">
						<DatePicker
							v-model="date1"
							placeholder="Format DD/MM/YYYY"
							format="DD/MM/YYYY"
							noCalendar
						/>
						<DatePicker
							v-model="date2"
							placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
							format="DD/MM/YYYY"
							dateFormatReturn="YYYY-MM-DD"
							noCalendar
						/>
						<DatePicker
							v-model="dateRange"
							placeholder="Plage avec format DD/MM/YYYY"
							format="DD/MM/YYYY"
							displayRange
							noCalendar
						/>
						<div class="mt-4">
							<p>Valeurs retournées :</p>
							<pre>Date simple : {{ date1 }}</pre>
							<pre>Date avec format retour : {{ date2 }}</pre>
							<pre>Plage de dates : {{ dateRange }}</pre>
						</div>
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
					
					const date1 = ref('24/12/2025')
					const date2 = ref('24/12/2025')
					const dateRange = ref(['24/12/2025', '31/12/2025'])
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const date1 = ref('24/12/2025')
				const date2 = ref('24/12/2025')
				const dateRange = ref(['24/12/2025', '31/12/2025'])
				return { date1, date2, dateRange }
			},
			template: `
              <div class="d-flex flex-column gap-4 pa-4">
                <DatePicker
                    v-model="date1"
                    placeholder="Format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    noCalendar
                />
                <DatePicker
                    v-model="date2"
                    placeholder="Format DD/MM/YYYY, retour YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    dateFormatReturn="YYYY-MM-DD"
                    noCalendar
                />
                <DatePicker
                    v-model="dateRange"
                    placeholder="Plage avec format DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    displayRange
                    noCalendar
                />
                <div class="mt-4">
                    <p>Valeurs retournées :</p>
                    <pre>Date simple : {{ date1 }}</pre>
                    <pre>Date avec format retour : {{ date2 }}</pre>
                    <pre>Plage de dates : {{ dateRange }}</pre>
                </div>
              </div>
            `,
		}
	},
}
