import type { Meta, StoryObj } from '@storybook/vue3'
import PeriodField from './PeriodField.vue'
import { ref } from 'vue'

const meta: Meta<typeof PeriodField> = {
	title: 'Composants/Formulaires/PeriodField',
	component: PeriodField,
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
			table: {
				type: {
					summary: 'object',
				},
			},
		},
		placeholderFrom: {
			control: 'text',
			description: 'Placeholder pour la date de début',
		},
		placeholderTo: {
			control: 'text',
			description: 'Placeholder pour la date de fin',
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
		isOutlined: {
			control: 'boolean',
			description: 'Affiche le champ en contour',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
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
} as Meta<typeof PeriodField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PeriodField v-model="selectedPeriod" />
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
              </div>
            `,
		}
	},
}

export const CustomPlaceholders: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PeriodField 
						v-model="selectedPeriod" 
						placeholder-from="Début de la période"
						placeholder-to="Fin de la période"
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début de la période',
		placeholderTo: 'Fin de la période',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
              </div>
            `,
		}
	},
}

export const Disabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PeriodField 
						v-model="selectedPeriod" 
						is-disabled
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: true,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PeriodField 
						v-model="selectedPeriod"
						required
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: true,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
              </div>
            `,
		}
	},
}

export const AppendIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PeriodField 
						v-model="selectedPeriod"
						displayAppendIcon
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		required: true,
		displayIcon: true,
		displayAppendIcon: true,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
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
					<PeriodField 
						v-model="selectedPeriod"
						:display-icon="false"
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: null, to: null })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: true,
		displayIcon: false,
		displayAppendIcon: true,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
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
					<PeriodField 
						v-model="selectedPeriod"
						:custom-rules="[
							{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd'hui' } }
						]"
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: '01/01/2100', to: '05/01/2100' })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: true,
		displayIcon: false,
		displayAppendIcon: true,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: '01/01/2100', to: '05/01/2100' },
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
		],
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: '01/01/2100', to: '05/01/2100' })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
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
					<PeriodField 
						v-model="selectedPeriod"
						:custom-warning-rules="[
							{ type: 'notBeforeDate', options: { 
								warningMessage: 'Attention : les dates sont antérieures à la date de référence',
								date: '01/01/2031',
								isWarning: true,
							} }
						]"
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const date = ref('20/12/2023')
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: true,
		displayIcon: false,
		displayAppendIcon: true,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: '20/12/2023', to: '21/12/2023' },
		customWarningRules: [
			{
				type: 'notBeforeDate', options: {
					warningMessage: 'Attention : les dates sont antérieures à la date de référence',
					date: '01/01/2024',
					isWarning: true,
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: '20/12/2023', to: '21/12/2023' })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				<p>Période sélectionnée : {{ value }}</p>
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
					<PeriodField 
						v-model="selectedPeriod"
						:custom-rules="[
							{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } }
						]"
					/>
					<p>Période sélectionnée : {{ selectedPeriod }}</p>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: '22/01/2024', to: '23/01/2024 })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: true,
		displayIcon: false,
		displayAppendIcon: true,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: '22/01/2024', to: '23/01/2024' },
		customRules: [
			{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } },
		],
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value = ref({ from: '22/01/2024', to: '23/01/2024' })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value"/>
				  <p>Période sélectionnée : {{ value }}</p>
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
					<PeriodField 
						v-model="selectedPeriod"
						format="DD/MM/YYYY"
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="MM/DD/YYYY"
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="YYYY-MM-DD"
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="DD-MM-YY"
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="DD.MM.YYYY"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const selectedPeriod = ref({ from: '12/10/2023', to: '15/10/2023' })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: '12/10/2023', to: '15/10/2023' },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value1 = ref({ from: '12/10/2023', to: '15/10/2023' })
				const value2 = ref({ from: '10/12/2023', to: '10/15/2023' })
				const value3 = ref({ from: '2023-10-12', to: '2023-10-15' })
				const value4 = ref({ from: '12-10-23', to: '15-10-23' })
				const value5 = ref({ from: '12.10.2023', to: '15.10.2023' })
				return { args, value1, value2, value3, value4, value5 }
			},
			template: `
              <div class="pa-4">
                <PeriodField v-bind="args" v-model="value1" format="DD/MM/YYYY"  />
				<PeriodField v-bind="args" v-model="value2" format="MM/DD/YYYY"  />
				<PeriodField v-bind="args" v-model="value3" format="YYYY-MM-DD"  />
				<PeriodField v-bind="args" v-model="value4" format="DD-MM-YY"  />
				<PeriodField v-bind="args" v-model="value5" format="DD.MM.YYYY"  />
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
				<span class="mb-4">Période de retour : {{ value1 }}</span>
				<PeriodField
					v-model="value1"
					format="DD/MM/YYYY"
				/>

				<span class="mb-4">Période de retour : {{ value2 }}</span>
				<PeriodField
					v-model="value2"
					format="DD/MM/YYYY"
					date-format-return="MM/DD/YYYY"
				/>

				<span class="mb-4">Période de retour : {{ value3 }}</span>
				<PeriodField
					v-model="value3"
					format="DD/MM/YYYY"
					date-format-return="YYYY-MM-DD"
				/>
			</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PeriodField } from '@cnamts/synapse'
					
					const value1 = ref({ from: '12/10/2023', to: '15/10/2023' })
					const value2 = ref({ from: '12/10/2023', to: '15/10/2023' })
					const value3 = ref({ from: '12/10/2023', to: '15/10/2023' })
				</script>
				`,
			},
		],
	},
	args: {
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: (args) => {
		return {
			components: { PeriodField: PeriodField },
			setup() {
				const value1 = ref({ from: '12/10/2023', to: '15/10/2023' })
				const value2 = ref({ from: '12/10/2023', to: '15/10/2023' })
				const value3 = ref({ from: '12/10/2023', to: '15/10/2023' })
				const valueReturn1 = ref({ from: '12/10/2023', to: '15/10/2023' })
				const valueReturn2 = ref({ from: '10/12/2023', to: '10/15/2023' })
				const valueReturn3 = ref({ from: '2023/12/10', to: '2023/15/10' })
				return { args, value1, value2, value3, valueReturn1, valueReturn2, valueReturn3 }
			},
			template: `
              <div class="pa-4">
				  <span>Période de retour : {{ valueReturn1 }}<br/><br/></span>
				  <PeriodField
					  v-bind="args"
					  v-model="value1"
					  format="DD/MM/YYYY"
					  date-format-return="DD/MM/YYYY"
				  />

				  <span>Période de retour : {{ valueReturn2 }}<br/><br/></span>
				  <PeriodField
					  v-bind="args"
					  v-model="value2"
					  format="DD/MM/YYYY"
					  date-format-return="MM/DD/YYYY"
				  />

				  <span>Période de retour : {{ valueReturn3 }}<br/><br/></span>
				  <PeriodField
					  v-bind="args"
					  v-model="value3"
					  format="DD/MM/YYYY"
					  date-format-return="YYYY-MM-DD"
				  />
              </div>
            `,
		}
	},
}
