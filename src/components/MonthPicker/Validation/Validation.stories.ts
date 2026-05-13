import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import MonthPicker from '../MonthPicker.vue'
import { fn } from '@storybook/test'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import type { MonthPickerProps } from '../types'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta = {
	title: 'Composants/Formulaires/MonthPicker/Validation',
	component: MonthPicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant MonthPicker`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('base'),
		modelValue: {
			control: 'text',
			description: 'Valeur du sélecteur de mois au format "MM/YYYY"',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
	},
	args: {
		'modelValue': '',
		'label': 'Mois de début',
		'required': false,
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'readonly': false,
		'disabled': false,
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'showSuccessMessages': true,
		'isValidateOnBlur': true,
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof MonthPicker>

export default meta

type Story = StoryObj<MonthPickerProps>

export const WithError: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						:custom-rules="customRules"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { MonthPicker } from '@cnamts/synapse'

					const selectedMonth = ref('13/2025')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const match = /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value)
									if (!match) {
										return 'Le format doit être MM/YYYY avec un mois entre 01 et 12 (ex: 03/2026).'
									}
									return true
								},
								fieldIdentifier: 'selectedMonth',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '13/2025',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const match = /^(0[1-9]|1[0-2])\/\d{4}$/.test(value)
						if (!match) {
							return 'Le format doit être MM/YYYY avec un mois entre 01 et 12 (ex: 03/2026).'
						}
						return true
					},
					fieldIdentifier: 'selectedMonth',
				},
			},
		],
	},
}

export const WithWarning: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						:custom-warning-rules="customWarningRules"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { MonthPicker } from '@cnamts/synapse'

					const selectedMonth = ref('01/2035')

					const customWarningRules = [
						{
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
								fieldIdentifier: 'selectedMonth',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '01/2035',
		customWarningRules: [
			{
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
					fieldIdentifier: 'selectedMonth',
				},
			},
		],
	},
}

export const WithSuccess: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						:custom-success-rules="customSuccessRules"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { MonthPicker } from '@cnamts/synapse'

					const selectedMonth = ref('06/2026')

					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const [, year] = value.split('/').map(Number) as [number, number]
									const currentYear = new Date().getFullYear()
									return year === currentYear
								},
								successMessage: 'La date est dans l\\'année en cours.',
								fieldIdentifier: 'selectedMonth',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '06/2026',
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const [, year] = value.split('/').map(Number) as [number, number]
						const currentYear = new Date().getFullYear()
						return year === currentYear
					},
					successMessage: 'La date est dans l\'année en cours.',
					fieldIdentifier: 'selectedMonth',
				},
			},
		],
	},
}

export const WithCustomRules: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						:custom-rules="customRules"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { MonthPicker } from '@cnamts/synapse'

					const selectedMonth = ref('')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || !/^\\d{2}\\/\\d{4}$/.test(value)) {
										return 'Le format doit être MM/YYYY (ex: 03/2026).'
									}
									return true
								},
								fieldIdentifier: 'selectedMonth',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const [month] = value.split('/').map(Number)
									if (!month || month < 1 || month > 12) {
										return 'Le mois doit être compris entre 01 et 12.'
									}
									return true
								},
								fieldIdentifier: 'selectedMonth',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const [, year] = value.split('/').map(Number) as [number, number]
									const currentYear = new Date().getFullYear()
									if (year < currentYear - 10) {
										return 'La date ne peut pas être antérieure à 10 ans.'
									}
									return true
								},
								fieldIdentifier: 'selectedMonth',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker },
		setup() {
			const selectedMonth = ref(args.modelValue ?? '')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^\d{2}\/\d{4}$/.test(value)) {
								return 'Le format doit être MM/YYYY (ex: 03/2026).'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							const [month] = value.split('/').map(Number)
							if (!month || month < 1 || month > 12) {
								return 'Le mois doit être compris entre 01 et 12.'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							const [, year] = value.split('/').map(Number) as [number, number]
							const currentYear = new Date().getFullYear()
							if (year < currentYear - 10) {
								return 'La date ne peut pas être antérieure à 10 ans.'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			return { args, selectedMonth, customRules }
		},
		template: `
			<MonthPicker
				v-bind="args"
				v-model="selectedMonth"
				:custom-rules="customRules"
				width="400px"
			/>
		`,
	}),
}

export const WithErrorWarningSuccess: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						required
						:custom-rules="customRules"
						:custom-warning-rules="customWarningRules"
						:custom-success-rules="customSuccessRules"
						:show-success-messages="true"
						:is-validate-on-blur="false"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { MonthPicker } from '@cnamts/synapse'

					const selectedMonth = ref('')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || !/^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value)) {
										return 'Le format doit être MM/YYYY avec un mois valide (ex: 03/2026).'
									}
									return true
								},
								fieldIdentifier: 'selectedMonth',
							},
						},
					]

					const customWarningRules = [
						{
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
								fieldIdentifier: 'selectedMonth',
							},
						},
					]

					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const [, year] = value.split('/').map(Number) as [number, number]
									const currentYear = new Date().getFullYear()
									return year >= currentYear && year <= currentYear + 5
								},
								successMessage: 'Date dans un horizon de planification raisonnable.',
								fieldIdentifier: 'selectedMonth',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker },
		setup() {
			const selectedMonth = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
								return 'Le format doit être MM/YYYY avec un mois valide (ex: 03/2026).'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			const customWarningRules = [
				{
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
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			const customSuccessRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							const [, year] = value.split('/').map(Number) as [number, number]
							const currentYear = new Date().getFullYear()
							return year >= currentYear && year <= currentYear + 5
						},
						successMessage: 'Date dans un horizon de planification raisonnable.',
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			return { args, selectedMonth, customRules, customWarningRules, customSuccessRules }
		},
		template: `
			<div>
				<p class="mb-2">Saisissez un mois pour voir les différents types de validation :</p>
				<MonthPicker
					v-model="selectedMonth"
					:variant-style="args.variantStyle"
					label="Mois de début"
					required
					:custom-rules="customRules"
					:custom-warning-rules="customWarningRules"
					:custom-success-rules="customSuccessRules"
					:show-success-messages="true"
					:is-validate-on-blur="true"
					width="400px"
				/>
				<div class="mt-4">
					<p><strong>Conseils pour tester :</strong></p>
					<ul>
						<li>Laissez le champ vide pour voir l'erreur de champ requis</li>
						<li>Saisissez un mois invalide (ex: 13/2026) pour voir l'erreur de format</li>
						<li>Saisissez une date à plus de 5 ans (ex: 01/2032) pour voir l'avertissement</li>
						<li>Saisissez une date entre aujourd'hui et dans 5 ans pour voir le message de succès</li>
					</ul>
				</div>
			</div>
		`,
	}),
}

export const NoSuccessMessages: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: `
### Messages de succès

Cette story illustre l'utilisation de la propriété \`showSuccessMessages\` qui permet de contrôler
l'affichage des messages de succès lors de la validation. Par défaut, cette propriété est à \`true\`.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec messages de succès (par défaut) -->
  <MonthPicker
    v-model="value1"
    label="Avec messages de succès"
    required
  />

  <!-- Champ sans messages de succès -->
  <MonthPicker
    v-model="value2"
    label="Sans messages de succès"
    required
    :show-success-messages="false"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { MonthPicker },
		setup() {
			const value1 = ref('06/2026')
			const value2 = ref('06/2026')
			return { value1, value2 }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un MonthPicker avec <code>showSuccessMessages=true</code> (par défaut) et un avec <code>showSuccessMessages=false</code>.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Avec messages de succès</p>
						<MonthPicker
							v-model="value1"
							label="Mois de début"
							required
							show-success-messages
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans messages de succès</p>
						<MonthPicker
							v-model="value2"
							label="Mois de début"
							required
							:show-success-messages="false"
						/>
					</div>
				</div>

				<div class="mt-4 text-body-2">
					<p>Observations :</p>
					<ul>
						<li class="ml-4">Les deux champs ont la même valeur valide</li>
						<li class="ml-4">Le champ de gauche affiche un message de succès et un indicateur visuel vert</li>
						<li class="ml-4">Le champ de droite n'affiche pas de message de succès, mais conserve l'indicateur visuel</li>
					</ul>
				</div>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: `
### Désactivation de la gestion des erreurs

Cette story illustre l'utilisation de la propriété \`disableErrorHandling\` qui permet de désactiver complètement
la gestion et l'affichage des erreurs dans un champ, même si des règles de validation sont définies.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec validation normale -->
  <MonthPicker
    v-model="value1"
    label="Avec validation"
    required
    :custom-rules="customRules"
  />

  <!-- Champ avec gestion d'erreurs désactivée -->
  <MonthPicker
    v-model="value2"
    label="Sans gestion d'erreurs"
    required
    disable-error-handling
    :custom-rules="customRules"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { MonthPicker },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
								return 'Le format doit être MM/YYYY avec un mois valide (ex: 03/2026).'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			return { value1, value2, customRules }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un MonthPicker standard et un avec <code>disableErrorHandling=true</code>.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Validation normale</p>
						<MonthPicker
							v-model="value1"
							label="Mois de début"
							required
							:custom-rules="customRules"
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
						<MonthPicker
							v-model="value2"
							label="Mois de début"
							required
							disable-error-handling
							:custom-rules="customRules"
						/>
					</div>
				</div>

				<div class="mt-4 text-body-2">
					<p>Instructions :</p>
					<ol>
						<li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
						<li class="ml-4">Le champ de gauche affichera une erreur requise, mais pas celui de droite</li>
					</ol>
				</div>
			</div>
		`,
	}),
}

/**
 * Validation déclenchée à chaque frappe (isValidateOnBlur: false).
 */
export const ValidateOnInput: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation à la saisie

Lorsque \`isValidateOnBlur\` vaut \`false\`, la validation se déclenche à chaque modification
de la valeur plutôt qu'à la perte de focus. Utile pour un retour immédiat à l'utilisateur.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<MonthPicker
		v-model="selectedMonth"
		label="Mois de début"
		required
		:is-validate-on-blur="false"
		:custom-rules="[
			{
				type: 'custom',
				options: {
					message: 'Le format doit être MM/YYYY (ex: 03/2026).',
					validate: (value) => /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value),
				},
			},
		]"
		show-success-messages
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker } from '@cnamts/synapse'

const selectedMonth = ref('')
</script>`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker },
		setup() {
			const selectedMonth = ref('')
			return { args, selectedMonth }
		},
		template: `
			<div>
				<p class="mb-4">La validation se déclenche à chaque frappe (<code>isValidateOnBlur="false"</code>).</p>
				<MonthPicker
					v-model="selectedMonth"
					label="Mois de début"
					required
					:is-validate-on-blur="false"
					:custom-rules="[
						{
							type: 'custom',
							options: {
								message: 'Le format doit être MM/YYYY (ex: 03/2026).',
								validate: (value) => /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value),
							},
						},
					]"
					show-success-messages
					width="400px"
				/>
			</div>
		`,
	}),
}

/**
 * Messages de validation injectés directement par le parent (errorMessages, warningMessages, successMessages).
 */
export const ExternalMessages: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Messages externes

Les props \`errorMessages\`, \`warningMessages\` et \`successMessages\` permettent d'injecter
des messages depuis le parent sans déclencher de règle de validation.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<MonthPicker
		v-model="selectedMonth"
		label="Mois de début"
		:error-messages="errorMessages"
		:warning-messages="warningMessages"
		:success-messages="successMessages"
	/>
	<div class="mt-4">
		<VBtn @click="setError">Simuler une erreur</VBtn>
		<VBtn @click="setWarning" class="ml-2">Simuler un avertissement</VBtn>
		<VBtn @click="setSuccess" class="ml-2">Simuler un succès</VBtn>
		<VBtn @click="reset" class="ml-2">Réinitialiser</VBtn>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker } from '@cnamts/synapse'

const selectedMonth = ref('')
const errorMessages = ref<string[] | null>(null)
const warningMessages = ref<string[] | null>(null)
const successMessages = ref<string[] | null>(null)

function setError() {
	errorMessages.value = ['Ce mois est déjà utilisé dans un autre dossier']
	warningMessages.value = null
	successMessages.value = null
}
function setWarning() {
	errorMessages.value = null
	warningMessages.value = ["Ce mois est proche d'une échéance importante"]
	successMessages.value = null
}
function setSuccess() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = ['Mois accepté par le serveur']
}
function reset() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = null
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker, VBtn },
		setup() {
			const selectedMonth = ref('')
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Ce mois est déjà utilisé dans un autre dossier']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Ce mois est proche d\'une échéance importante']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Mois accepté par le serveur']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, selectedMonth, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div>
				<p class="mb-4">
					Les messages ci-dessous sont injectés par le parent sans déclencher de règle de validation.
				</p>
				<MonthPicker
					v-model="selectedMonth"
					label="Mois de début"
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
					width="400px"
				/>
				<div class="mt-4 d-flex flex-wrap ga-2">
					<VBtn color="error" variant="outlined" @click="setError">Simuler une erreur</VBtn>
					<VBtn color="warning" variant="outlined" @click="setWarning">Simuler un avertissement</VBtn>
					<VBtn color="success" variant="outlined" @click="setSuccess">Simuler un succès</VBtn>
					<VBtn variant="outlined" @click="reset">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation de style Vuetify

En passant \`useVuetifyValidation="true"\`, le composant délègue la validation à Vuetify.
Les règles sont de simples fonctions qui retournent \`true\` si la valeur est valide,
ou un message d'erreur (chaîne de caractères) sinon — exactement comme avec la prop \`rules\`
native de Vuetify.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<MonthPicker
			v-model="selectedMonth"
			label="Mois de début"
			:use-vuetify-validation="true"
			:rules="rules"
			required
			:is-validate-on-blur="true"
		/>
		<div class="mt-4">
			<VBtn type="submit" color="primary">Valider</VBtn>
		</div>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker } from '@cnamts/synapse'

const selectedMonth = ref('')

const rules = [
	(value: string) => !!value || 'Le mois est requis',
	(value: string) => /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value) || 'Le format doit être MM/YYYY (ex: 03/2026)',
]

async function handleSubmit(e) {
	alert(e.isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker, VBtn, VForm },
		setup() {
			const selectedMonth = ref('')
			const fieldRef = ref()

			const rules = [
				(value: string) => !!value || 'Le mois est requis',
				(value: string) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value) || 'Le format doit être MM/YYYY (ex: 03/2026)',
			]

			async function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selectedMonth, fieldRef, rules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">
					Les règles sont des fonctions Vuetify natives <code>(value) => true | 'message'</code>.
					Cliquez sur <strong>Valider</strong> ou quittez le champ pour déclencher la validation.
				</p>
				<VForm @submit.prevent="handleSubmit">
					<MonthPicker
						v-model="selectedMonth"
						label="Mois de début"
						:use-vuetify-validation="true"
						:rules="rules"
						:is-validate-on-blur="true"
						width="400px"
					/>
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <SyForm @submit="handleSubmit">
        <MonthPicker
            v-model="selectedMonth"
            label="Mois de début"
            :custom-rules="customRules"
			required
        />
        <div class="mt-4">
            <VBtn type="submit" color="primary">Valider</VBtn>
        </div>
    </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker, SyForm } from '@cnamts/synapse'

const selectedMonth = ref('')

const customRules = [
    {
        type: 'custom',
        options: {
            validate: (value: string) => {
                if (!value || !/^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value)) {
                    return 'Le format doit être MM/YYYY avec un mois valide (ex: 03/2026).'
                }
                return true
            },
            fieldIdentifier: 'selectedMonth',
        },
    },
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker, VBtn, SyForm },
		setup() {
			const selectedMonth = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
								return 'Le format doit être MM/YYYY avec un mois valide (ex: 03/2026).'
							}
							return true
						},
						fieldIdentifier: 'selectedMonth',
					},
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				console.log(e)
				const isValid = e.isValid
				alert(isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selectedMonth, customRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<MonthPicker
						v-model="selectedMonth"
						v-bind="args"
						:custom-rules="customRules"
						width="400px"
						required
					/>
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <SyForm @submit="handleSubmit">
        <MonthPicker
            v-model="selectedMonth"
            label="Mois de début"
            :use-vuetify-validation="true"
            :rules="vuetifyRules"
        />
        <div class="mt-4">
            <VBtn type="submit" color="primary">Valider</VBtn>
        </div>
    </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker, SyForm } from '@cnamts/synapse'

const selectedMonth = ref('')

const vuetifyRules = [
    (value: string) => !!value || 'Le mois est requis',
    (value: string) => /^(0[1-9]|1[0-2])\\/\\d{4}$/.test(value) || 'Le format doit être MM/YYYY (ex: 03/2026)',
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { MonthPicker, VBtn, SyForm },
		setup() {
			const selectedMonth = ref('')

			const vuetifyRules = [
				(value: string) => !!value || 'Le mois est requis',
				(value: string) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value) || 'Le format doit être MM/YYYY (ex: 03/2026)',
			]

			function handleSubmit(e: { isValid: boolean }) {
				const isValid = e.isValid
				alert(isValid ? 'Mois valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selectedMonth, vuetifyRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<MonthPicker
						v-model="selectedMonth"
						v-bind="args"
						:use-vuetify-validation="true"
						:rules="vuetifyRules"
						width="400px"
					/>
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}
