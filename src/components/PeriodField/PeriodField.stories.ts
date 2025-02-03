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
