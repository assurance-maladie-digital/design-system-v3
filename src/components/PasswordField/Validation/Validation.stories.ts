import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'
import PasswordField from '../PasswordField.vue'
import type { PasswordFieldProps } from '../types'
import { fn } from '@storybook/test'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

type PasswordFieldStoryArgs = PasswordFieldProps & {
	'onUpdate:modelValue': (...args: unknown[]) => unknown
	'onSubmit': (...args: unknown[]) => unknown
}

const meta = {
	title: 'Composants/Formulaires/PasswordField/Validation',
	component: PasswordField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant PasswordField`,
			},
		},
	},
	argTypes: {
		modelValue: {
			control: 'text',
			description: 'Valeur du champ de mot de passe',
		},
		variantStyle: {
			control: 'select',
			options: ['outlined', 'underlined'],
			description: 'Style du champ (contour ou souligné)',
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'error', 'warning', 'success', 'info'],
			description: 'Couleur principale du champ',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
		required: {
			control: 'boolean',
			description: 'Indique si le champ est obligatoire',
		},
		errorMessages: {
			control: 'object',
			description: 'Messages d\'erreur à afficher',
		},
		warningMessages: {
			control: 'object',
			description: 'Messages d\'avertissement à afficher',
		},
		successMessages: {
			control: 'object',
			description: 'Messages de succès à afficher',
		},
		readonly: {
			control: 'boolean',
			description: 'Indique si le champ est en lecture seule',
		},
		disabled: {
			control: 'boolean',
			description: 'Indique si le champ est désactivé',
		},
		placeholder: {
			control: 'text',
			description: 'Texte d\'indication affiché lorsque le champ est vide',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation personnalisées',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées',
		},
		customSuccessRules: {
			control: 'object',
			description: 'Règles de succès personnalisées',
		},
		showSuccessMessages: {
			control: 'boolean',
			description: 'Indique si les messages de succès doivent être affichés',
		},
		displayAsterisk: {
			control: 'boolean',
			description: 'Affiche un astérisque à côté du libellé pour indiquer que le champ est obligatoire',
		},
		isValidateOnBlur: {
			control: 'boolean',
			description: 'Indique si la validation doit être effectuée lors de la perte de focus',
		},
		bgColor: {
			control: 'color',
			description: 'Couleur de fond du champ',
		},
		autocompleteType: {
			control: 'select',
			options: ['current-password', 'new-password'],
			description: 'Type d\'auto-complétion',
			default: 'current-password',
		},
	},
	args: {
		'modelValue': '',
		'variantStyle': 'outlined',
		'color': 'primary',
		'label': 'Mot de passe',
		'required': false,
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'readonly': false,
		'disabled': false,
		'placeholder': 'Entrez votre mot de passe',
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'showSuccessMessages': true,
		'displayAsterisk': false,
		'isValidateOnBlur': true,
		'bgColor': 'white',
		'onUpdate:modelValue': fn(),
		'onSubmit': fn(),
	},
} as Meta<PasswordFieldStoryArgs>

export default meta

type Story = StoryObj<PasswordFieldStoryArgs>

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
					<PasswordField
						v-model="password"
						label="Mot de passe"
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
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('Mdp123')
					
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'Mdp123',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value || value.length < 8) {
							return 'Le mot de passe doit contenir au moins 8 caractères'
						}
						return true
					},
					fieldIdentifier: 'password',
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
					<PasswordField
						v-model="password"
						label="Mot de passe"
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
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MotDePasse123')
					
					const customWarningRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
									if (!hasSpecialChar) {
										return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'MotDePasse123',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
						if (!hasSpecialChar) {
							return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux'
						}
						return true
					},
					fieldIdentifier: 'password',
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
					<PasswordField
						v-model="password"
						label="Mot de passe"
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
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MotDePasse123!@#')
					
					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const hasUpperCase = /[A-Z]/.test(value)
									const hasLowerCase = /[a-z]/.test(value)
									const hasNumber = /[0-9]/.test(value)
									const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
									const hasMinLength = value.length >= 8
									
									if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength) {
										return 'Mot de passe fort'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'MotDePasse123!@#',
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const hasUpperCase = /[A-Z]/.test(value)
						const hasLowerCase = /[a-z]/.test(value)
						const hasNumber = /[0-9]/.test(value)
						const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
						const isLongEnough = value.length >= 8

						if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough) {
							return true
						}
						return false
					},
					successMessage: 'Mot de passe fort',
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
					<PasswordField
						v-model="password"
						label="Mot de passe"
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
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('')
					
					// Règles personnalisées pour la validation du mot de passe
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || !/[A-Z]/.test(value)) {
										return 'Le mot de passe doit contenir au moins une lettre majuscule'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || !/[0-9]/.test(value)) {
										return 'Le mot de passe doit contenir au moins un chiffre'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref(args.modelValue ?? '')

			// Règles personnalisées pour la validation du mot de passe
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[A-Z]/.test(value)) {
								return 'Le mot de passe doit contenir au moins une lettre majuscule'
							}
							return true
						},
						fieldIdentifier: 'password',
						successMessage: 'Le mot de passe est sécurisé',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[0-9]/.test(value)) {
								return 'Le mot de passe doit contenir au moins un chiffre'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			return { args, password, customRules }
		},
		template: `
			<PasswordField
				v-bind="args"
				v-model="password"
				:custom-rules="customRules"
			/>
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

Cela peut être utile pour réduire la verbosité de l'interface lorsque les messages de succès
ne sont pas nécessaires dans certains contextes.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec messages de succès (par défaut) -->
  <PasswordField
    v-model="value1"
    label="Mot de passe avec messages de succès"
    required
  />

  <!-- Champ sans messages de succès -->
  <PasswordField
    v-model="value2"
    label="Mot de passe sans messages de succès"
    required
    :showSuccessMessages="false"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { PasswordField },
		setup() {
			const value1 = ref('P@ssw0rd123')
			const value2 = ref('P@ssw0rd123')

			return { value1, value2 }
		},
		template: `
      <div>
        <p class="mb-4">Cette démonstration compare un PasswordField avec <code>showSuccessMessages=true</code> (par défaut) et un avec <code>showSuccessMessages=false</code>.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
          <div>
            <p class="text-subtitle-2 mb-2">Avec messages de succès</p>
            <PasswordField
              v-model="value1"
              label="Mot de passe avec messages de succès"
              required
              showSuccessMessages
            />
          </div>

          <div>
            <p class="text-subtitle-2 mb-2">Sans messages de succès</p>
            <PasswordField
              v-model="value2"
              label="Mot de passe sans messages de succès"
              required
              :showSuccessMessages="false"
            />
          </div>
        </div>

        <div class="mt-4 text-body-2">
          <p>Observations :</p>
          <ul>
            <li class="ml-4">Les deux champs ont la même valeur valide</li>
            <li class="ml-4">Le champ de gauche affiche un message de succès et un indicateur visuel vert</li>
            <li class="ml-4">Le champ de droite n'affiche pas de message de succès, mais conserve l'indicateur visuel</li>
            <li class="ml-4">Essayez de modifier les valeurs puis de les rendre à nouveau valides</li>
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

Cela peut être utile dans des cas particuliers où vous souhaitez définir des règles de validation
mais gérer leur affichage différemment, ou utiliser la validation uniquement au niveau du formulaire parent.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec validation normale -->
  <PasswordField
    v-model="value1"
    label="Mot de passe avec validation"
    required
    :custom-rules="customRules"
  />

  <!-- Champ avec gestion d'erreurs désactivée -->
  <PasswordField
    v-model="value2"
    label="Mot de passe sans gestion d'erreurs"
    required
    disableErrorHandling
    :custom-rules="customRules"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { PasswordField },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			return { value1, value2, customRules }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un PasswordField standard et un avec \`disableErrorHandling=true\`.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Validation normale</p>
						<PasswordField
							v-model="value1"
							label="Mot de passe avec validation"
							required
							:custom-rules="customRules"
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
						<PasswordField
							v-model="value2"
							label="Mot de passe sans gestion d'erreurs"
							required
							disableErrorHandling
							:custom-rules="customRules"
						/>
					</div>
				</div>

				<div class="mt-4 text-body-2">
					<p>Instructions :</p>
					<ol>
						<li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
						<li class="ml-4">Le champ de gauche affichera une erreur requise, mais pas celui de droite</li>
						<li class="ml-4">Vous pouvez également essayer de soumettre les deux champs pour voir la différence de comportement</li>
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
	<PasswordField
		v-model="password"
		label="Mot de passe"
		required
		:is-validate-on-blur="false"
		:custom-rules="[
			{
				type: 'custom',
				options: {
					message: 'Au moins 8 caractères requis',
					validate: (value) => value.length >= 8,
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
import { PasswordField } from '@cnamts/synapse'

const password = ref('')
</script>`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref('')
			return { args, password }
		},
		template: `
			<div>
				<p class="mb-4">La validation se déclenche à chaque frappe (<code>isValidateOnBlur="false"</code>).</p>
				<PasswordField
					v-model="password"
					label="Mot de passe"
					required
					:is-validate-on-blur="false"
					:custom-rules="[
						{
							type: 'custom',
							options: {
								message: 'Au moins 8 caractères requis',
								validate: (value) => value.length >= 8,
							},
						},
					]"
					show-success-messages
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

Les props \`errorMessages\`, \`warningMessages\` et \`successMessages\`
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PasswordField
		v-model="password"
		label="Mot de passe"
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
import { PasswordField } from '@cnamts/synapse'

const password = ref('')
const errorMessages = ref<string[] | null>(null)
const warningMessages = ref<string[] | null>(null)
const successMessages = ref<string[] | null>(null)

function setError() {
	errorMessages.value = ['Ce mot de passe a déjà été utilisé']
	warningMessages.value = null
	successMessages.value = null
}
function setWarning() {
	errorMessages.value = null
	warningMessages.value = ['Ce mot de passe figure dans une liste de mots de passe courants']
	successMessages.value = null
}
function setSuccess() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = ['Mot de passe accepté par le serveur']
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
		components: { PasswordField },
		setup() {
			const password = ref('')
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Ce mot de passe a déjà été utilisé']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Ce mot de passe figure dans une liste de mots de passe courants']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Mot de passe accepté par le serveur']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, password, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div>
				<p class="mb-4">
					Les messages ci-dessous sont injectés par le parent sans déclencher de règle de validation.
				</p>
				<PasswordField
					v-model="password"
					label="Mot de passe"
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
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
native de Vuetify (\`VTextField\`, etc.).

Cela permet de réutiliser des règles existantes écrites pour Vuetify sans adaptation.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<PasswordField
			ref="fieldRef"
			v-model="password"
			label="Mot de passe"
			:use-vuetify-validation="true"
			:rules="rules"
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
import { PasswordField } from '@cnamts/synapse'

const password = ref('')
const fieldRef = ref()

const rules = [
	(value: string) => !!value || 'Le mot de passe est requis',
	(value: string) => value.length >= 8 || 'Au moins 8 caractères requis',
	(value: string) => /[A-Z]/.test(value) || 'Au moins une lettre majuscule requise',
	(value: string) => /[0-9]/.test(value) || 'Au moins un chiffre requis',
	(value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Au moins un caractère spécial requis',
]

async function handleSubmit() {
	const isValid = await fieldRef.value?.validateOnSubmit()
	alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { PasswordField, VBtn },
		setup() {
			const password = ref('')
			const fieldRef = ref()

			const rules = [
				(value: string) => !!value || 'Le mot de passe est requis',
				(value: string) => value.length >= 8 || 'Au moins 8 caractères requis',
				(value: string) => /[A-Z]/.test(value) || 'Au moins une lettre majuscule requise',
				(value: string) => /[0-9]/.test(value) || 'Au moins un chiffre requis',
				(value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Au moins un caractère spécial requis',
			]

			async function handleSubmit() {
				const isValid = await fieldRef.value?.validateOnSubmit()
				alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, password, fieldRef, rules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">
					Les règles sont des fonctions Vuetify natives <code>(value) => true | 'message'</code>.
					Cliquez sur <strong>Valider</strong> ou quittez le champ pour déclencher la validation.
				</p>
				<VForm @submit.prevent="handleSubmit">
					<PasswordField
						ref="fieldRef"
						v-model="password"
						label="Mot de passe"
						:use-vuetify-validation="true"
						:rules="rules"
						:is-validate-on-blur="true"
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
    <SyForm @submit.prevent="handleSubmit">
        <PasswordField
            ref="fieldRef"
            v-model="password"
            label="Mot de passe"
            :use-syform-validation="true"
            :custom-rules="customRules"
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
import { PasswordField } from '@cnamts/synapse'

const password = ref('')

const customRules = [
    {
        type: 'custom',
        options: {
            validate: (value: string) => {
                if (!value || value.length < 8) {
                    return 'Le mot de passe doit contenir au moins 8 caractères'
                }
                return true
            },
            fieldIdentifier: 'password',
        },
    },
    {
        type: 'custom',
        options: {
            validate: (value: string) => {
                if (!value || !/[A-Z]/.test(value)) {
                    return 'Le mot de passe doit contenir au moins une lettre majuscule'
                }
                return true
            },
            fieldIdentifier: 'password',
        },
    },
]

function handleSubmit(e) {
    // La validation est gérée par SyForm, on peut juste vérifier le résultat
    const isValid = e.isValid
    alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { PasswordField, VBtn, SyForm },
		setup() {
			const password = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[A-Z]/.test(value)) {
								return 'Le mot de passe doit contenir au moins une lettre majuscule'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			function handleSubmit(e) {
				// La validation est gérée par SyForm, on peut juste vérifier le résultat
				const isValid = e.isValid
				alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, password, customRules, handleSubmit }
		},
		template: `
            <div>
                <SyForm @submit.prevent="handleSubmit">
                    <PasswordField
                        v-model="password"
                        v-bind="args"
                        :custom-rules="customRules"
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
        <PasswordField
            v-model="password"
            label="Mot de passe"
            :use-syform-validation="true"
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
import { PasswordField } from '@cnamts/synapse'

const password = ref('')

const vuetifyRules = [
    (value: string) => !!value || 'Le mot de passe est requis',
    (value: string) => value.length >= 8 || 'Au moins 8 caractères requis',
    (value: string) => /[A-Z]/.test(value) || 'Au moins une lettre majuscule requise',
    (value: string) => /[0-9]/.test(value) || 'Au moins un chiffre requis',
    (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Au moins un caractère spécial requis',
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { PasswordField, VBtn, SyForm },
		setup() {
			const password = ref('')

			const vuetifyRules = [
				(value: string) => !!value || 'Le mot de passe est requis',
				(value: string) => value.length >= 8 || 'Au moins 8 caractères requis',
				(value: string) => /[A-Z]/.test(value) || 'Au moins une lettre majuscule requise',
				(value: string) => /[0-9]/.test(value) || 'Au moins un chiffre requis',
				(value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Au moins un caractère spécial requis',
			]

			function handleSubmit(e) {
				const isValid = e.isValid
				alert(isValid ? 'Mot de passe valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, password, vuetifyRules, handleSubmit }
		},
		template: `
            <div>
                <SyForm @submit="handleSubmit">
                    <PasswordField
                        v-model="password"
                        v-bind="args"
                        :use-syform-validation="true"
                        :use-vuetify-validation="true"
                        :rules="vuetifyRules"
                    />
                    <div class="mt-4">
                        <VBtn type="submit" color="primary">Valider</VBtn>
                    </div>
                </SyForm>
            </div>
        `,
	}),
}
