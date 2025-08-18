import type { Meta, StoryObj } from '@storybook/vue3'
import PeriodField from './PeriodField.vue'
import { ref } from 'vue'

// Type pour les méthodes exposées par PeriodField
type ValidationMessage = { type: string, message: string }[]

interface PeriodFieldExpose {
	validateOnSubmit: () => boolean
	errors: Record<string, ValidationMessage>
	successes: Record<string, ValidationMessage>
	warnings: Record<string, ValidationMessage>
	isValid: boolean
}

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
		disabled: {
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
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs',
		},
		showSuccessMessages: {
			control: 'boolean',
			description: 'Affiche les messages de succès',
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
					<p>Période sélectionnée : <pre>{{ selectedPeriod }}</pre></p>
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
						disabled
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
		disabled: true,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: '01/01/2100', to: '05/01/2100' },
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
		],
	},
	render: args => ({
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
	}),
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
								warningMessage: 'Attention : les dates sont antérieures au 02/01/2031',
								date: '02/01/2031',
								isWarning: true,
								fieldIdentifier: 'fromDate'
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
					
					const date = ref('20/12/2031')
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
		disabled: false,
		noIcon: false,
		modelValue: { from: '20/12/2023', to: '21/12/2023' },
		customWarningRules: [
			{
				type: 'notBeforeDate', options: {
					warningMessage: 'Attention : les dates sont antérieures au 02/01/2031',
					date: '02/01/2031',
					isWarning: true,
				},
			},
		],
	},
	render: args => ({
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
	}),
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
							{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend', successMessage: 'La date n\\'est pas un week-end' } }
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
		displayIcon: false,
		displayAppendIcon: true,
		disabled: false,
		noIcon: false,
		modelValue: { from: '22/01/2024', to: '23/01/2024' },
		customRules: [
			{
				type: 'notWeekend',
				options: {
					message: 'La date ne peut pas être un weekend',
					successMessage: 'La date n\'est pas un week-end',
				},
			},
		],
	},
	render: args => ({
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
	}),
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
						class="mb-4" 
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="MM/DD/YYYY"
						class="mb-4" 
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="YYYY-MM-DD"
						class="mb-4" 
					 />
					<PeriodField 
						v-model="selectedPeriod"
						format="DD-MM-YY"
						class="mb-4" 
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
		disabled: false,
		noIcon: false,
		modelValue: { from: '12/10/2023', to: '15/10/2023' },
	},
	render: args => ({
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
                <PeriodField v-bind="args" v-model="value1" format="DD/MM/YYYY" class="mb-4" />
                <PeriodField v-bind="args" v-model="value2" format="MM/DD/YYYY" class="mb-4" />
                <PeriodField v-bind="args" v-model="value3" format="YYYY-MM-DD" class="mb-4" />
                <PeriodField v-bind="args" v-model="value4" format="DD-MM-YY" class="mb-4" />
                <PeriodField v-bind="args" v-model="value5" format="DD.MM.YYYY"/>
              </div>
            `,
	}),
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
		disabled: false,
		noIcon: false,
		modelValue: { from: null, to: null },
	},
	render: args => ({
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
	}),
}

export const ValidationBehaviors: Story = {
	parameters: {
		sourceCode: [
			{
				code: `<template>
	<div class="mb-8">
		<h3 class="mb-4">Par défaut (avec validation)</h3>
		<PeriodField
			v-model="periodDefault"
			required
		/>
	</div>

	<div class="mb-8">
		<h3 class="mb-4">Validation désactivée (disableErrorHandling=true)</h3>
		<PeriodField
			v-model="periodNoErrors"
			required
			:disable-error-handling="true"
		/>
	</div>

	<div class="mb-8">
		<h3 class="mb-4">Messages de succès désactivés (showSuccessMessages=false)</h3>
		<PeriodField
			v-model="periodNoSuccess"
			required
			:show-success-messages="false"
		/>
	</div>

	<div class="mb-8">
		<h3 class="mb-4">Validation et messages de succès désactivés</h3>
		<PeriodField
			v-model="periodNoValidation"
			required
			:disable-error-handling="true"
			:show-success-messages="false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PeriodField from '../PeriodField.vue'

const periodDefault = ref({ from: null, to: null })
const periodNoErrors = ref({ from: null, to: null })
const periodNoSuccess = ref({ from: null, to: null })
const periodNoValidation = ref({ from: null, to: null })
</script>`,
			},
		],
	},
	render: args => ({
		components: { PeriodField },
		setup() {
			const periodDefault = ref({ from: null, to: null })
			const periodNoErrors = ref({ from: null, to: null })
			const periodNoSuccess = ref({ from: null, to: null })
			const periodNoValidation = ref({ from: null, to: null })

			return {
				args,
				periodDefault,
				periodNoErrors,
				periodNoSuccess,
				periodNoValidation,
			}
		},
		template: `
			<div class="mb-8">
				<h3 class="mb-4">Par défaut (avec validation)</h3>
				<PeriodField
					v-model="periodDefault"
					required
				/>
			</div>

			<div class="mb-8">
				<h3 class="mb-4">Validation désactivée (disableErrorHandling=true)</h3>
				<PeriodField
					v-model="periodNoErrors"
					required
					:disable-error-handling="true"
				/>
			</div>

			<div class="mb-8">
				<h3 class="mb-4">Messages de succès désactivés (showSuccessMessages=false)</h3>
				<PeriodField
					v-model="periodNoSuccess"
					required
					:show-success-messages="false"
				/>
			</div>

			<div class="mb-8">
				<h3 class="mb-4">Validation et messages de succès désactivés</h3>
				<PeriodField
					v-model="periodNoValidation"
					required
					:disable-error-handling="true"
					:show-success-messages="false"
				/>
			</div>
		`,
	}),
}

export const FormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<v-form @submit.prevent="submitForm" ref="formRef">
						<v-container>
							<v-row>
								<v-col cols="12">
									<h3>Formulaire avec validation</h3>
								</v-col>
								<v-col cols="12" md="6">
									<PeriodField
										v-model="form.period"
										ref="periodFieldRef"
										required
										:custom-rules="periodRules"
										placeholder-from="Début de l'événement"
										placeholder-to="Fin de l'événement"
									/>
								</v-col>
								<v-col cols="12">
									<v-btn type="submit" color="primary" :disabled="isSubmitting">Valider</v-btn>
								</v-col>
							</v-row>
							
							<v-row v-if="isFormSubmitted">
								<v-col cols="12">
									<v-alert
										type="success"
										class="mt-4"
									>
										Formulaire envoyé avec succès !
									</v-alert>
									<pre>{{ formData }}</pre>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
				import { ref } from 'vue'
				import { PeriodField } from '@cnamts/synapse'
				
				// Référence au formulaire
				const formRef = ref(null)
				const isSubmitting = ref(false)
				const isFormSubmitted = ref(false)
				const formData = ref(null)
				
				// Données du formulaire
				const form = {
					name: '',
					period: { from: null, to: null }
				}
				
				// Règles de validation pour le champ période
				const periodRules = [
					{ 
						type: 'custom', 
						options: { 
							validator: (value) => {
								if (!value.from || !value.to) return 'Les deux dates sont obligatoires'
								return true
							},
							successMessage: 'Période valide'
						}
					},
					{
						type: 'notAfterToday',
						options: { message: "La date ne peut pas être après aujourd'hui" }
					}
				]
				
				// Soumission du formulaire
				const submitForm = () => {
				if (periodFieldRef.value) {
					const isValid = periodFieldRef.value.validateOnSubmit()
					if (isValid) {
						formStatus.value = 'Formulaire soumis avec succès !'
						isFormSubmitted.value = true
						formData.value = JSON.stringify(form.value)
					}
					else {
						formStatus.value = 'Erreur de validation, veuillez corriger les champs'
					}
				}
			}
				</script>
				`,
			},
		],
	},
	render: () => ({
		components: { PeriodField },
		setup() {
			// Référence au formulaire
			const formRef = ref(null)
			const periodFieldRef = ref<PeriodFieldExpose | null>(null)
			const isSubmitting = ref(false)
			const isFormSubmitted = ref(false)
			const formData = ref<string | null>(null)
			const formStatus = ref('')

			// Données du formulaire
			const form = ref({
				period: { from: null, to: null },
			})

			// Règles de validation pour le champ période
			const periodRules = [
				{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourdhui' } },
			]

			// Soumission du formulaire
			const submitForm = () => {
				if (periodFieldRef.value) {
					const isValid = periodFieldRef.value.validateOnSubmit()
					if (isValid) {
						formStatus.value = 'Formulaire soumis avec succès !'
						isFormSubmitted.value = true
						formData.value = JSON.stringify(form.value)
					}
					else {
						formStatus.value = 'Erreur de validation, veuillez corriger les champs'
					}
				}
			}

			return {
				formRef,
				periodFieldRef,
				isSubmitting,
				isFormSubmitted,
				formData,
				form,
				periodRules,
				formStatus,
				submitForm,
			}
		},
		template: `
			<div class="pa-4">
				<v-form @submit.prevent="submitForm" ref="formRef">
					<v-container>
						<v-row>
							<v-col cols="12">
								<h3>Formulaire avec validation</h3>
							</v-col>
							<v-col cols="12" md="6">
								<PeriodField
									v-model="form.period"
									ref="periodFieldRef"
									required
									:custom-rules="periodRules"
									placeholder-from="Début de l'événement"
									placeholder-to="Fin de l'événement"
								/>
							</v-col>
							<v-col cols="12">
								<v-btn type="submit" color="primary" :disabled="isSubmitting">Valider</v-btn>
							</v-col>
						</v-row>
						
						<v-row v-if="formStatus">
							<v-col cols="12">
								<v-alert
									:type="isFormSubmitted ? 'success' : 'error'"
									class="mt-4"
								>
									{{ formStatus }}
								</v-alert>
								<pre v-if="formData">{{ formData }}</pre>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</div>
		`,
	}),
}
