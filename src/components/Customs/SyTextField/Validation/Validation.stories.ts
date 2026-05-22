import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { fn } from '@storybook/test'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'

const meta = {
	title: 'Composants/Formulaires/SyTextField/Validation',
	component: SyTextField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant SyTextField`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('string'),
		modelValue: {
			control: 'text',
			description: 'Valeur du champ texte',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
	},
	args: {
		'modelValue': '',
		'label': 'Nom',
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
} as Meta<typeof SyTextField>

export default meta

type Story = StoryObj<FieldValidationProps>

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
					<SyTextField
						v-model="value"
						label="Adresse email"
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
					import { SyTextField } from '@cnamts/synapse'

					const value = ref('not-an-email')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
									if (!valid) {
										return 'L\\'adresse email est invalide.'
									}
									return true
								},
								fieldIdentifier: 'email',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		modelValue: 'not-an-email',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
						if (!valid) {
							return 'L\'adresse email est invalide.'
						}
						return true
					},
					fieldIdentifier: 'email',
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
					<SyTextField
						v-model="value"
						label="Nom d'utilisateur"
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
					import { SyTextField } from '@cnamts/synapse'

					const value = ref('ab')

					const customWarningRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value.length >= 3,
								warningMessage: 'Le nom d\\'utilisateur est très court (moins de 3 caractères).',
								fieldIdentifier: 'username',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Nom d\'utilisateur',
		modelValue: 'ab',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => value.length >= 3,
					warningMessage: 'Le nom d\'utilisateur est très court (moins de 3 caractères).',
					fieldIdentifier: 'username',
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
					<SyTextField
						v-model="value"
						label="Adresse email"
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
					import { SyTextField } from '@cnamts/synapse'

					const value = ref('exemple@domaine.fr')

					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
								successMessage: 'L\\'adresse email est valide.',
								fieldIdentifier: 'email',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		modelValue: 'exemple@domaine.fr',
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
					successMessage: 'L\'adresse email est valide.',
					fieldIdentifier: 'email',
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
					<SyTextField
						v-model="value"
						label="Mot de passe"
						type="password"
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
					import { SyTextField } from '@cnamts/synapse'

					const value = ref('')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value) return 'Le mot de passe est requis.'
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!/[A-Z]/.test(value)) return 'Le mot de passe doit contenir au moins une majuscule.'
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
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue ?? '')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value) return 'Le mot de passe est requis.'
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!/[A-Z]/.test(value)) return 'Le mot de passe doit contenir au moins une majuscule.'
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			return { args, value, customRules }
		},
		template: `
			<SyTextField
				v-bind="args"
				v-model="value"
				label="Mot de passe"
				type="password"
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
					<SyTextField
						v-model="value"
						label="Nom d'utilisateur"
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
					import { SyTextField } from '@cnamts/synapse'

					const value = ref('')

					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 3) {
										return 'Le nom doit contenir au moins 3 caractères.'
									}
									return true
								},
								fieldIdentifier: 'username',
							},
						},
					]

					const customWarningRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value.length <= 20,
								warningMessage: 'Le nom est très long (plus de 20 caractères).',
								fieldIdentifier: 'username',
							},
						},
					]

					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value.length >= 3 && value.length <= 20,
								successMessage: 'Le nom d\\'utilisateur est valide.',
								fieldIdentifier: 'username',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 3) {
								return 'Le nom doit contenir au moins 3 caractères.'
							}
							return true
						},
						fieldIdentifier: 'username',
					},
				},
			]

			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => value.length <= 20,
						warningMessage: 'Le nom est très long (plus de 20 caractères).',
						fieldIdentifier: 'username',
					},
				},
			]

			const customSuccessRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => value.length >= 3 && value.length <= 20,
						successMessage: 'Le nom d\'utilisateur est valide.',
						fieldIdentifier: 'username',
					},
				},
			]

			return { args, value, customRules, customWarningRules, customSuccessRules }
		},
		template: `
			<div>
				<p class="mb-2">Saisissez un nom d'utilisateur pour voir les différents types de validation :</p>
				<SyTextField
					v-bind="args"
					v-model="value"
					label="Nom d'utilisateur"
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
						<li>Saisissez 1 ou 2 caractères pour voir l'erreur de longueur minimale</li>
						<li>Saisissez plus de 20 caractères pour voir l'avertissement</li>
						<li>Saisissez entre 3 et 20 caractères pour voir le message de succès</li>
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
  <SyTextField
    v-model="value1"
    label="Avec messages de succès"
    required
  />

  <!-- Champ sans messages de succès -->
  <SyTextField
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
		components: { SyTextField },
		setup() {
			const value1 = ref('valeur valide')
			const value2 = ref('valeur valide')
			return { value1, value2 }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un SyTextField avec <code>showSuccessMessages=true</code> (par défaut) et un avec <code>showSuccessMessages=false</code>.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Avec messages de succès</p>
						<SyTextField
							v-model="value1"
							label="Nom"
							required
							show-success-messages
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans messages de succès</p>
						<SyTextField
							v-model="value2"
							label="Nom"
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
  <SyTextField
    v-model="value1"
    label="Avec validation"
    required
    :custom-rules="customRules"
  />

  <!-- Champ avec gestion d'erreurs désactivée -->
  <SyTextField
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
		components: { SyTextField },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.trim().length === 0) {
								return 'Ce champ est requis.'
							}
							return true
						},
						fieldIdentifier: 'field',
					},
				},
			]

			return { value1, value2, customRules }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un SyTextField standard et un avec <code>disableErrorHandling=true</code>.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Validation normale</p>
						<SyTextField
							v-model="value1"
							label="Nom"
							required
							:custom-rules="customRules"
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
						<SyTextField
							v-model="value2"
							label="Nom"
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
	<SyTextField
		v-model="value"
		label="Adresse email"
		required
		:is-validate-on-blur="false"
		:custom-rules="[
			{
				type: 'custom',
				options: {
					message: 'L\\'adresse email est invalide.',
					validate: (value) => /^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/.test(value),
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
import { SyTextField } from '@cnamts/synapse'

const value = ref('')
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<div>
				<p class="mb-4">La validation se déclenche à chaque frappe (<code>isValidateOnBlur="false"</code>).</p>
				<SyTextField
					v-model="value"
					label="Adresse email"
					required
					:is-validate-on-blur="false"
					:custom-rules="[
						{
							type: 'custom',
							options: {
								message: 'L\\'adresse email est invalide.',
								validate: (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
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
	<SyTextField
		v-model="value"
		label="Nom"
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
import { SyTextField } from '@cnamts/synapse'

const value = ref('')
const errorMessages = ref<string[] | null>(null)
const warningMessages = ref<string[] | null>(null)
const successMessages = ref<string[] | null>(null)

function setError() {
	errorMessages.value = ['Ce nom est déjà utilisé']
	warningMessages.value = null
	successMessages.value = null
}
function setWarning() {
	errorMessages.value = null
	warningMessages.value = ['Ce nom ressemble à un nom générique']
	successMessages.value = null
}
function setSuccess() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = ['Nom accepté par le serveur']
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
		components: { SyTextField, VBtn },
		setup() {
			const value = ref('')
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Ce nom est déjà utilisé']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Ce nom ressemble à un nom générique']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Nom accepté par le serveur']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, value, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div>
				<p class="mb-4">
					Les messages ci-dessous sont injectés par le parent sans déclencher de règle de validation.
				</p>
				<SyTextField
					v-model="value"
					label="Nom"
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

export const VFormVuetifyValidation: Story = {
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
		<SyTextField
			v-model="value"
			label="Adresse email"
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
import { SyTextField } from '@cnamts/synapse'

const value = ref('')

const rules = [
	(value: string) => !!value || 'Ce champ est requis',
	(value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || 'L\\'adresse email est invalide',
]

async function handleSubmit(e) {
	alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, VForm },
		setup() {
			const value = ref('')

			const rules = [
				(value: string) => !!value || 'Ce champ est requis',
				(value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'L\'adresse email est invalide',
			]

			async function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, rules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">
					Les règles sont des fonctions Vuetify natives <code>(value) => true | 'message'</code>.
					Cliquez sur <strong>Valider</strong> ou quittez le champ pour déclencher la validation.
				</p>
				<VForm @submit.prevent="handleSubmit">
					<SyTextField
						v-model="value"
						label="Adresse email"
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
        <SyTextField
            v-model="value"
            label="Adresse email"
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
import { SyTextField, SyForm } from '@cnamts/synapse'

const value = ref('')

const customRules = [
    {
        type: 'custom',
        options: {
            validate: (value: string) => {
                if (!value || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
                    return 'L\\'adresse email est invalide.'
                }
                return true
            },
            fieldIdentifier: 'email',
        },
    },
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, SyForm },
		setup() {
			const value = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
								return 'L\'adresse email est invalide.'
							}
							return true
						},
						fieldIdentifier: 'email',
					},
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				console.log(e)
				const isValid = e.isValid
				alert(isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, customRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<SyTextField
						v-model="value"
						v-bind="args"
						label="Adresse email"
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
        <SyTextField
            v-model="value"
            label="Adresse email"
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
import { SyTextField, SyForm } from '@cnamts/synapse'

const value = ref('')

const vuetifyRules = [
    (value: string) => !!value || 'Ce champ est requis',
    (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || 'L\\'adresse email est invalide',
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, SyForm },
		setup() {
			const value = ref('')

			const vuetifyRules = [
				(value: string) => !!value || 'Ce champ est requis',
				(value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'L\'adresse email est invalide',
			]

			function handleSubmit(e: { isValid: boolean }) {
				const isValid = e.isValid
				alert(isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, vuetifyRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<SyTextField
						v-model="value"
						v-bind="args"
						label="Adresse email"
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

export const EmailValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation d'email

Cette story montre un cas d'usage courant : la validation d'une adresse email. Le champ :
- Est requis
- Vérifie le format de l'email
- Affiche un message de succès quand l'email est valide
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTextField
	v-model="value"
	autocomplete="email"
	label="Email"
	helpText="Format attendu : nom@domaine.fr"
	required
	:customRules="[
		{
			type: 'email',
			options: {
				message: 'L'email n'est pas valide'
				successMessage: 'L'email est valide'
			}
		}
	]"
	showSuccessMessages
/>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<SyTextField
				v-model="value"
				v-bind="args"
				label="Email"
				helpText="Format attendu : nom@domaine.fr"
				autocomplete="email"
				required
				:customRules="[
					{
						type: 'email',
						options: {
							message: 'L\\'email n\\'est pas valide',
							successMessage: 'L\\'email est valide'
						}
					}
				]"
				showSuccessMessages
			/>
		`,
	}),
}
